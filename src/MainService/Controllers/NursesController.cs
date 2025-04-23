using AutoMapper;
using CloudinaryDotNet; 
using CloudinaryDotNet.Actions; 
using MainService.Authorization.Operations;
using MainService.Core.DTOs.Notification;
using MainService.Core.DTOs.Nurses; 
using MainService.Core.DTOs.User;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Hubs;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using MainService.Models.Enums;
using Microsoft.AspNetCore.SignalR;

namespace MainService.Controllers;

[Authorize(Roles = "Doctor, Admin")]
public class NursesController(
    IUnitOfWork uow,
    UserManager<AppUser> userManager,
    ICloudinaryService cloudinaryService, 
    IAuthorizationService authorizationService,
    INotificationsService notificationsService,
    IHubContext<NotificationHub> hubContext,
    IMapper mapper,
    IEmailService emailService
) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<NurseDto>>> GetPagedListAsync([FromQuery] NurseParams param)
    {
        var requestingDoctorId = User.GetUserId();
        if (requestingDoctorId <= 0)
        {
            Log.Warning("GetPagedListAsync Nurses: Unauthorized attempt - User ID not found in token.");
            return Unauthorized();
        }

        if (!User.IsInRole("Admin"))
        {
            param.DoctorId = requestingDoctorId;
        }
        else if (!param.DoctorId.HasValue)
        {
            param.DoctorId = null;
            Log.Information("Admin user requested nurse list without specifying DoctorId. Returning all associated nurses.");
        }

        var pagedList = await uow.NurseRepository.GetPagedListAsync(param);

        Response.AddPaginationHeader(new PaginationHeader(
            pagedList.CurrentPage,
            pagedList.PageSize,
            pagedList.TotalCount,
            pagedList.TotalPages
        ));

        return Ok(pagedList);
    }

    [HttpGet("options")]
    public async Task<ActionResult<List<OptionDto>>> GetOptionDtosAsync([FromQuery] NurseParams param)
    {
        var requestingDoctorId = User.GetUserId();
        if (requestingDoctorId <= 0)
        {
            Log.Warning("GetOptionDtosAsync Nurses: Unauthorized attempt - User ID not found in token.");
            return Unauthorized();
        }

        if (!User.IsInRole("Admin"))
        {
            param.DoctorId = requestingDoctorId;
        }
        else if (!param.DoctorId.HasValue)
        {
            param.DoctorId = null;
            Log.Information("Admin user requested nurse options without specifying DoctorId. Returning all associated nurses.");
        }

        var options = await uow.NurseRepository.GetOptionsAsync(param);
        return Ok(options);
    }

    [HttpPost("associate")]
    public async Task<ActionResult<UserDto>> AssociateNurseAsync([FromBody] NurseAssociateDto request) 
    {
        var doctorNurse = new DoctorNurse();
        
        var requestingDoctorId = User.GetUserId();
        if (requestingDoctorId <= 0)
        {
            return Unauthorized("Información de doctor inválida.");
        }

        doctorNurse.DoctorId = requestingDoctorId;
        
        var createAuthResult = await authorizationService.AuthorizeAsync(User, doctorNurse, NurseOperations.CreateAssociation);
        if (!createAuthResult.Succeeded)
        {
            Log.Warning("AssociateNurseAsync: Forbidden attempt by User {UserId}. Missing CreateAssociation permission.", User.GetUserId());
            return Forbid();
        }

        var requestingDoctor = await uow.UserRepository.GetByIdAsync(requestingDoctorId);
        if (requestingDoctor == null)
        {
            return NotFound("Doctor solicitante no encontrado.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        if (request.Email.Equals(requestingDoctor.Email, StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("No puedes asociarte a ti mismo como especialista.");
        }

        var potentialNurseUser = await userManager.FindByEmailAsync(request.Email);

        if (potentialNurseUser != null)
        {
            // Scenario 1: Nurse User Exists
            Log.Information("User found with email {Email}. Checking association and role.", request.Email);

            bool alreadyAssociated = await uow.DoctorNurseRepository.FindByCompositeKeyAsync(requestingDoctorId, potentialNurseUser.Id) != null;
            if (alreadyAssociated)
            {
                Log.Warning("Nurse {NurseId} is already associated with Doctor {DoctorId}.", potentialNurseUser.Id, requestingDoctorId);
                return Conflict($"Este/a especialista ({request.Email}) ya está asociado/a contigo.");
            }
            
            bool isNurse = await userManager.IsInRoleAsync(potentialNurseUser, "Nurse");
            if (!isNurse)
            {
                Log.Warning("User {UserId} exists but lacks 'Nurse' role. Association denied.", potentialNurseUser.Id);
                return BadRequest($"El usuario con correo {request.Email} existe, pero no está registrado como Especialista en la plataforma. Pídeles que actualicen su perfil o invítalos correctamente.");
            }

            Log.Information("Associating existing Nurse {NurseId} with Doctor {DoctorId}.", potentialNurseUser.Id, requestingDoctorId);
            doctorNurse.DoctorId = requestingDoctorId;
            uow.DoctorNurseRepository.Add(doctorNurse);

            var nurseNotification = await notificationsService.CreateForNurseAssociated(potentialNurseUser, requestingDoctor);
            
            if (!await uow.Complete())
            {
                Log.Error("Failed to save DoctorNurse association between Doctor {DoctorId} and Nurse {NurseId}.", requestingDoctorId, potentialNurseUser.Id);
                return BadRequest("Error al guardar la asociación con el/la especialista.");
            }

            if (nurseNotification != null)
            {
                await uow.UserNotificationRepository.AddAsync(nurseNotification);
                if (await uow.Complete())
                {
                    await NotifyUserAsync(potentialNurseUser.Id, mapper.Map<NotificationDto>(nurseNotification));
                }
                else
                {
                    Log.Warning("Failed to save UserNotification link for Nurse {NurseId} associated by Doctor {DoctorId}.", potentialNurseUser.Id, requestingDoctorId);
                }
            }

            var nurseDto = await uow.UserRepository.GetDtoByIdAsync(potentialNurseUser.Id);
            return Ok(nurseDto);
        }
        else
        {
            // Scenario 2: User Does Not Exist - Invitation Flow
            Log.Information("User with email {Email} not found. Initiating invitation flow.", request.Email);

            var token = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
            var expiryDate = DateTime.UtcNow.AddDays(7);

            var invitation = new Invitation
            {
                InvitingUserId = requestingDoctorId,
                InviteeEmail = request.Email,
                RoleInvitedAs = "Nurse", 
                Status = InvitationStatus.Pending,
                Token = token,
                ExpiryDate = expiryDate,
            };

            await uow.InvitationRepository.AddAsync(invitation);
            
            var doctorInviteNotification = await notificationsService.CreateForDoctorInvitationSent(requestingDoctor, request.Email);

            if (!await uow.Complete())
            {
                Log.Error("Failed to save invitation record for email {Email} invited by Doctor {DoctorId}.", request.Email, requestingDoctorId);
                return BadRequest("Error al guardar la invitación.");
            }
            
            if (doctorInviteNotification != null)
            {
                await uow.UserNotificationRepository.AddAsync(doctorInviteNotification);
                if (await uow.Complete())
                {
                    await NotifyUserAsync(requestingDoctorId, mapper.Map<NotificationDto>(doctorInviteNotification));
                } else {
                    Log.Warning("Failed to save UserNotification link for doctor invitation sent confirmation DoctorId {DoctorId}.", requestingDoctorId);
                }
            }

            try
            {
                await emailService.SendNurseInvitationEmailAsync(requestingDoctor, request.Email, token, expiryDate, request.FirstName);
                Log.Information("Invitation email sent to {Email} for Doctor {DoctorId}.", request.Email, requestingDoctorId);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Failed to send invitation email to {Email} for Doctor {DoctorId}.", request.Email, requestingDoctorId);
                return Ok(new
                {
                    message = $"Invitación creada para {request.Email}, pero hubo un problema al enviar el correo. Pídeles que revisen su bandeja de entrada o spam, o contáctales directamente."
                });
            }

            return Ok(new
            {
                message = $"Invitación enviada a {request.Email}. Necesitan registrarse o iniciar sesión para aceptar."
            });
        }
    }

    [HttpDelete("dissociate/{nurseId:int}")]
    [Authorize(Roles = "Doctor, Admin")]
    public async Task<IActionResult> DissociateNurseAsync(int nurseId)
    {
        var requestingDoctorId = User.GetUserId();
        if (requestingDoctorId <= 0) return Unauthorized();

        var nurseUser = await uow.UserRepository.GetByIdAsync(nurseId);
        if (nurseUser == null)
        {
            return NotFound("Especialista no encontrado/a.");
        }

        AppUser? nurseToNotify = null;
        
        var association = await uow.DoctorNurseRepository.FindByCompositeKeyAsync(requestingDoctorId, nurseId);
        if (association == null)
        {
            return NotFound("La asociación entre este doctor y especialista no existe.");
        }
        
        nurseToNotify = association.Nurse;

        var authResult = await authorizationService.AuthorizeAsync(User, association, NurseOperations.DeleteAssociation);
        if (!authResult.Succeeded)
        {
            Log.Warning("DissociateNurseAsync: Authorization failed for User {UserId} on DoctorNurse resource (Doctor {DoctorId}, Nurse {NurseId}).", User.GetUserId(), association.DoctorId, association.NurseId);
            return Forbid();
        }

        uow.DoctorNurseRepository.Remove(association);
        
        var nurseDissociatedNotification = await notificationsService.CreateForNurseDissociated(nurseToNotify, association.Doctor); 

        if (!await uow.Complete())
        {
            Log.Error("Failed to remove DoctorNurse association between Doctor {DoctorId} and Nurse {NurseId}.", requestingDoctorId, nurseId);
            return BadRequest("Error al eliminar la asociación.");
        }
        
        if (nurseDissociatedNotification != null)
        {
            await uow.UserNotificationRepository.AddAsync(nurseDissociatedNotification);
            if (await uow.Complete())
            {
                await NotifyUserAsync(nurseToNotify.Id, mapper.Map<NotificationDto>(nurseDissociatedNotification));
            } else {
                Log.Warning("Failed to save UserNotification for nurse dissociation (NurseId {NurseId}).", nurseToNotify.Id);
            }
        }

        Log.Information("Successfully removed DoctorNurse association between Doctor {DoctorId} and Nurse {NurseId}.", requestingDoctorId, nurseId);
        return NoContent(); 
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


    private async Task<ImageUploadResult?> UploadImage(IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            Log.Warning("UploadImage: Attempted to upload a null or empty file.");
            return null;
        }

        var fileName = Guid.NewGuid().ToString();
        var uploadParams = new ImageUploadParams
        {
            Folder = "Mediverse/Users",
            File = new FileDescription(fileName, file.OpenReadStream()),
            Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
        };

        try
        {
            var uploadResult = await cloudinaryService.UploadAsync(file, uploadParams);


            if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK && uploadResult.Error == null)
            {
                Log.Information("UploadImage: Successfully uploaded image to Cloudinary. PublicId: {PublicId}, Url: {Url}", uploadResult.PublicId, uploadResult.SecureUrl);
                return uploadResult;
            }

            Log.Error("UploadImage: Cloudinary upload failed for file {OriginalFileName}. Status: {StatusCode}, Error: {ErrorMessage}", file.FileName, uploadResult.StatusCode, uploadResult.Error?.Message ?? "N/A");
            return null;
        }
        catch (Exception ex)
        {
            Log.Error(ex, "UploadImage: Exception occurred during Cloudinary upload for file {OriginalFileName}", file.FileName);
            return null;
        }
    }
}