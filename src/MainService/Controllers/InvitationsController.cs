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
    [HttpGet("details/{token}")]
    [AllowAnonymous]
    public async Task<ActionResult<InvitationDetailsResponse>> GetInvitationDetailsAsync(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return BadRequest(new InvitationDetailsResponse { Message = "Token inválido." });
        }

        var invitation = await uow.InvitationRepository.GetByTokenAsync(token, includeInvitingUser: true);

        if (invitation == null)
        {
            Log.Warning("GetInvitationDetails: Token not found: {Token}", token);
            return NotFound();
        }

        if (invitation.Status != InvitationStatus.Pending)
        {
            Log.Warning("GetInvitationDetails: Invitation {InvitationId} already processed. Status: {Status}", invitation.Id, invitation.Status);

            var doctorDto = invitation.InvitingUser != null
                ? mapper.Map<InvitingDoctorSummary>(invitation.InvitingUser)
                : null;
            
            return Ok(new InvitationDetailsResponse
            {
                IsValid = false, Message = "Esta invitación ya ha sido procesada.",
                InvitingDoctor = doctorDto,
                RoleInvitedAs = invitation.RoleInvitedAs
            });
        }

        if (invitation.ExpiryDate < DateTime.UtcNow)
        {
            Log.Warning("GetInvitationDetails: Invitation {InvitationId} expired on {ExpiryDate}", invitation.Id, invitation.ExpiryDate);

            var doctorDto = invitation.InvitingUser != null
                ? mapper.Map<InvitingDoctorSummary>(invitation.InvitingUser)
                : null;
            
            return Ok(new InvitationDetailsResponse
            {
                IsValid = false, Message = "Esta invitación ha expirado.", 
                InvitingDoctor = doctorDto,
                RoleInvitedAs = invitation.RoleInvitedAs
            });
        }

        if (invitation.InvitingUser == null)
        {
            Log.Error("GetInvitationDetails: Invitation {InvitationId} is valid but InvitingUser is null.", invitation.Id);
            
            return BadRequest("Error al cargar los datos del doctor que invita.");
        }

        var invitingDoctorSummary = mapper.Map<InvitingDoctorSummary>(invitation.InvitingUser);

        return Ok(new InvitationDetailsResponse
        {
            IsValid = true,
            InvitingDoctor = invitingDoctorSummary,
            RoleInvitedAs = invitation.RoleInvitedAs,
            Message = "Invitación válida."
        });
    }

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
            await using var transaction = await uow.BeginTransactionAsync();
            Log.Debug("AcceptInvitation: Starting transaction for Nurse invitation {InvitationId}, User {UserId}", invitation.Id, currentUser.Id);

            try
            {
                bool needsRoleAdded = !(await userManager.IsInRoleAsync(currentUser, "Nurse"));
                if (needsRoleAdded)
                {
                    Log.Information("AcceptInvitation: Adding 'Nurse' role to user {UserId} as part of accepting invitation {InvitationId}.", currentUser.Id, invitation.Id);
                    var roleResult = await userManager.AddToRoleAsync(currentUser, "Nurse");
                    if (!roleResult.Succeeded)
                    {
                        await transaction.RollbackAsync();
                        Log.Error("AcceptInvitation: Failed to add 'Nurse' role to user {UserId} for invitation {InvitationId}. Errors: {@Errors}", currentUser.Id, invitation.Id, roleResult.Errors);
                        return BadRequest($"Error al asignar el rol de Especialista: {string.Join(", ", roleResult.Errors.Select(e => e.Description))}");
                    }

                    Log.Information("AcceptInvitation: Successfully added 'Nurse' role to user {UserId}.", currentUser.Id);
                }


                bool associationExists = await uow.DoctorNurseRepository.FindByCompositeKeyAsync(invitation.InvitingUserId, currentUser.Id) != null;
                if (!associationExists)
                {
                    var doctorNurse = new DoctorNurse(invitation.InvitingUserId, currentUser.Id);
                    uow.DoctorNurseRepository.Add(doctorNurse);
                    Log.Information("AcceptInvitation: Creating DoctorNurse link between Doctor {DoctorId} and Nurse {NurseId} for invitation {InvitationId}.", invitation.InvitingUserId, currentUser.Id, invitation.Id);
                }
                else
                {
                    Log.Information("AcceptInvitation: DoctorNurse link already exists between Doctor {DoctorId} and Nurse {NurseId}. Skipping creation.", invitation.InvitingUserId, currentUser.Id);
                }

                invitation.Status = InvitationStatus.Accepted;
                invitation.AcceptedDate = DateTime.UtcNow;
                invitation.AcceptedUserId = currentUser.Id;
                uow.InvitationRepository.Update(invitation);

                if (!await uow.Complete())
                {
                    await transaction.RollbackAsync();
                    Log.Error("AcceptInvitation: Failed to save changes (Role/Association/Invitation Update) after processing Nurse invitation {InvitationId}.", invitation.Id);
                    return BadRequest("Error al finalizar la aceptación de la invitación.");
                }

                await transaction.CommitAsync();
                Log.Debug("AcceptInvitation: Transaction committed for Nurse invitation {InvitationId}, User {UserId}", invitation.Id, currentUser.Id);

                AppUser? invitingDoctor = invitation.InvitingUser;
                var doctorNotification = invitingDoctor != null
                    ? await notificationsService.CreateForDoctorInvitationAccepted(invitingDoctor, currentUser)
                    : null;

                if (doctorNotification != null)
                {
                    await uow.UserNotificationRepository.AddAsync(doctorNotification);
                    if (await uow.Complete())
                    {
                        await NotifyUserAsync(invitation.InvitingUserId, mapper.Map<NotificationDto>(doctorNotification));
                    }
                    else
                    {
                        Log.Warning("Failed to save UserNotification link for invitation accepted confirmation DoctorId {DoctorId}.", invitation.InvitingUserId);
                    }
                }

                Log.Information("AcceptInvitation: Successfully accepted Nurse invitation {InvitationId} for user {UserId}.", invitation.Id, currentUser.Id);
                return Ok(new { message = "Invitación aceptada exitosamente. Ahora estás asociado/a con el doctor." });
            }
            catch (Exception ex)
            {
                Log.Error(ex, "AcceptInvitation: Exception occurred during Nurse invitation acceptance transaction for Invitation {InvitationId}, User {UserId}.", invitation.Id, currentUser.Id);
                await transaction.RollbackAsync();
                return StatusCode(500, "Ocurrió un error inesperado al procesar la invitación.");
            }
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