using AutoMapper;
using MainService.Core.DTOs.Invitations;
using MainService.Core.DTOs.Notification;
using MainService.Core.Extensions;
using MainService.Core.Interfaces.Services;
using MainService.Hubs;
using MainService.Models.Entities;
using MainService.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Serilog;

namespace MainService.Controllers;

public class InvitationsController(
    IUnitOfWork uow,
    UserManager<AppUser> userManager,
    IMapper mapper,
    INotificationsService notificationsService,
    IHubContext<NotificationHub> hubContext
) : BaseApiController
{
    [HttpPost("accept")]
    [AllowAnonymous]
    public async Task<IActionResult> AcceptInvitationAsync([FromBody] AcceptInvitationDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Token))
        {
            return BadRequest("Token de invitación inválido.");
        }

        var invitation = await uow.InvitationRepository.GetByTokenAsync(request.Token);

        if (invitation == null)
        {
            Log.Warning("AcceptInvitation: Invitation token not found: {Token}", request.Token);
            return NotFound("Invitación no encontrada o inválida.");
        }

        if (invitation.Status != InvitationStatus.Pending)
        {
            Log.Warning("AcceptInvitation: Invitation {InvitationId} already processed. Status: {Status}", invitation.Id, invitation.Status);
            return Conflict("Esta invitación ya ha sido procesada.");
        }

        if (invitation.ExpiryDate < DateTime.UtcNow)
        {
            Log.Warning("AcceptInvitation: Invitation {InvitationId} expired on {ExpiryDate}", invitation.Id, invitation.ExpiryDate);
            invitation.Status = InvitationStatus.Expired;
            uow.InvitationRepository.Update(invitation);
            await uow.Complete();
            return BadRequest("Esta invitación ha expirado.");
        }

        if (!User.Identity?.IsAuthenticated ?? true)
        {
            Log.Information("AcceptInvitation: User not authenticated for token {Token}. Requiring login.", request.Token);
            return Unauthorized(new
            {
                requiresAuthentication = true, token = request.Token,
                message = "Por favor, inicia sesión o regístrate para aceptar la invitación."
            });
        }

        var currentUserId = User.GetUserId();
        var currentUser = await userManager.FindByIdAsync(currentUserId.ToString());

        if (currentUser == null)
        {
            Log.Error("AcceptInvitation: Authenticated user {UserId} not found in database for token {Token}.", currentUserId, request.Token);
            return BadRequest("Error al verificar el usuario actual."); 
        }
        
        if (!currentUser.Email.Equals(invitation.InviteeEmail, StringComparison.OrdinalIgnoreCase))
        {
            Log.Warning("AcceptInvitation: Email mismatch. Invitation for {InviteeEmail}, logged in as {CurrentUserEmail} (User ID: {UserId}) for token {Token}.", invitation.InviteeEmail, currentUser.Email, currentUserId, request.Token);
            return BadRequest("Esta invitación es para un correo electrónico diferente al de tu cuenta actual.");
        }
        
        if (invitation.RoleInvitedAs == "Nurse")
        {
            AppUser? invitingDoctor = invitation.InvitingUser;
            
            bool alreadyAssociated = await uow.DoctorNurseRepository.FindByCompositeKeyAsync(invitation.InvitingUserId, currentUser.Id) != null;
            if (alreadyAssociated)
            {
                Log.Information("AcceptInvitation: Nurse {NurseId} already associated with Doctor {DoctorId}. Marking invitation {InvitationId} as accepted.", currentUser.Id, invitation.InvitingUserId, invitation.Id);
            }
            else
            {
                if (!await userManager.IsInRoleAsync(currentUser, "Nurse"))
                {
                    Log.Information("AcceptInvitation: Adding 'Nurse' role to user {UserId} as part of accepting invitation {InvitationId}.", currentUser.Id, invitation.Id);
                    var roleResult = await userManager.AddToRoleAsync(currentUser, "Nurse");
                    if (!roleResult.Succeeded)
                    {
                        Log.Error("AcceptInvitation: Failed to add 'Nurse' role to user {UserId} for invitation {InvitationId}. Errors: {@Errors}", currentUser.Id, invitation.Id, roleResult.Errors);
                        return BadRequest($"Error al asignar el rol de Especialista: {string.Join(", ", roleResult.Errors.Select(e => e.Description))}");
                    }
                }
                
                var doctorNurse = new DoctorNurse(invitation.InvitingUserId, currentUser.Id);
                uow.DoctorNurseRepository.Add(doctorNurse);
                Log.Information("AcceptInvitation: Creating DoctorNurse link between Doctor {DoctorId} and Nurse {NurseId} for invitation {InvitationId}.", invitation.InvitingUserId, currentUser.Id, invitation.Id);
            }
            
            invitation.Status = InvitationStatus.Accepted;
            invitation.AcceptedDate = DateTime.UtcNow;
            invitation.AcceptedUserId = currentUser.Id;
            uow.InvitationRepository.Update(invitation);
            
            var doctorNotification = invitingDoctor != null
                ? await notificationsService.CreateForDoctorInvitationAccepted(invitingDoctor, currentUser)
                : null;

            if (!await uow.Complete())
            {
                Log.Error("AcceptInvitation: Failed to save changes after processing Nurse invitation {InvitationId}.", invitation.Id);
                return BadRequest("Error al finalizar la aceptación de la invitación.");
            }
            
            if (doctorNotification != null)
            {
                await uow.UserNotificationRepository.AddAsync(doctorNotification);
                if (await uow.Complete()) 
                {
                    await NotifyUserAsync(invitation.InvitingUserId, mapper.Map<NotificationDto>(doctorNotification));
                } else {
                    Log.Warning("Failed to save UserNotification link for invitation accepted confirmation DoctorId {DoctorId}.", invitation.InvitingUserId);
                }
            }

            Log.Information("AcceptInvitation: Successfully accepted Nurse invitation {InvitationId} for user {UserId}.", invitation.Id, currentUser.Id);

            return Ok(new { message = "Invitación aceptada exitosamente. Ahora estás asociado/a con el doctor." });
        }

        Log.Error("AcceptInvitation: Unsupported RoleInvitedAs '{Role}' found in invitation {InvitationId}.", invitation.RoleInvitedAs, invitation.Id);
        return BadRequest("Tipo de invitación no soportado.");
    }
    
    private async Task NotifyUserAsync(int userId, NotificationDto? notification)
    {
        if (notification == null) return;
        try
        {
            await hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveNotification", notification);
            Log.Information("SignalR notification '{NotificationType}' sent to User {UserId}", notification.Type, userId);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Failed to send SignalR notification to User {UserId} for NotificationId {NotificationId}", userId, notification.Id);
        }
    }
}