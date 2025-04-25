using AutoMapper;
using MainService.Core.DTOs.DoctorNurses;
using MainService.Core.DTOs.Notification;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Serilog;

namespace MainService.Controllers;

[Authorize]
public class DoctorNursesController(
    IUnitOfWork uow,
    IMapper mapper,
    IHubContext<NotificationHub> hubContext,
    IDoctorNursesService doctorNursesService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<DoctorNurseDto>>> GetDoctorNurseConnections(
        [FromQuery] DoctorNurseParams param)
    {
        var pagedList = await uow.DoctorNurseRepository.GetPagedDoctorNurseConnectionsAsync(param);

        Response.AddPaginationHeader(new PaginationHeader(
            pagedList.CurrentPage,
            pagedList.PageSize,
            pagedList.TotalCount,
            pagedList.TotalPages
        ));

        return Ok(pagedList);
    }
    
    [HttpDelete("doctor/{doctorId:int}/nurse/{nurseId:int}")]
    public async Task<IActionResult> DeleteAssociationAsync(int doctorId, int nurseId)
    {
        var requestingUserId = User.GetUserId();
        
        if (!User.IsInRole("Admin") && requestingUserId != doctorId)
        {
            Log.Warning("Forbidden attempt by User {RequestingUserId} to delete association for Doctor {DoctorId} / Nurse {NurseId}", requestingUserId, doctorId, nurseId);
            return Forbid();
        }
        
        var (success, notificationRecord) = await doctorNursesService.DeleteAssociationAsync(doctorId, nurseId, requestingUserId);

        if (!success)
        {
            var associationExists = await uow.DoctorNurseRepository.FindByCompositeKeyAsync(doctorId, nurseId) != null;
            if (!associationExists)
            {
                return NotFound();
            }
            
            Log.Error("DeleteAssociationAsync in controller: Service reported failure for Doctor {DoctorId} / Nurse {NurseId}", doctorId, nurseId);
            return BadRequest("No se pudo eliminar la asociación.");
        }

        if (notificationRecord != null)
        {
            await NotifyUserAsync(nurseId, mapper.Map<NotificationDto>(notificationRecord));
        }
        else if (success) 
        {
            Log.Information("Association deleted for Doctor {DoctorId}/Nurse {NurseId}, but no notification was generated or persisted.", doctorId, nurseId);
        }

        return NoContent(); 
    }
     
    private async Task NotifyUserAsync(int userId, NotificationDto? notification)
    {
        if (notification == null) return;
        try
        {
            await hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveNotification", notification);
            Log.Information("SignalR notification '{NotificationType}' sent to User {UserId} from controller", notification.Type, userId);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Controller failed to send SignalR notification to User {UserId} for NotificationId {NotificationId}", userId, notification.Id);
            
        }
    }
}