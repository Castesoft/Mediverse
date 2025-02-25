using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using MainService.Core.DTOs.Nurses;
using MainService.Core.DTOs.User;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MainService.Controllers;

[Authorize]
public class NursesController(
    IUnitOfWork uow,
    UserManager<AppUser> userManager,
    IMapper mapper,
    IUsersService service,
    ICloudinaryService cloudinaryService
) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<NurseDto>>> GetPagedListAsync([FromQuery] NurseParams param)
    {
        param.DoctorId = User.GetUserId();
        param.UserId = User.GetUserId();

        var pagedList = await uow.NurseRepository.GetPagedListAsync(param);
        Response.AddPaginationHeader(new PaginationHeader(
            pagedList.CurrentPage,
            pagedList.PageSize,
            pagedList.TotalCount,
            pagedList.TotalPages
        ));

        return pagedList;
    }

    [HttpGet("options")]
    public async Task<ActionResult<List<OptionDto>>> GetOptionDtosAsync([FromQuery] NurseParams param)
    {
        param.DoctorId = User.GetUserId();
        param.UserId = User.GetUserId();

        return await uow.NurseRepository.GetOptionsAsync(param);
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateAsync([FromForm] NurseCreateDto request)
    {
        var requestingDoctorEmail = User.GetEmail();
        if (string.IsNullOrEmpty(requestingDoctorEmail)) return BadRequest("Email del doctor es requerido.");

        var nurse = await userManager.Users
            .Include(x => x.Doctors)
            .SingleOrDefaultAsync(x => x.Email == request.Email);

        var requestingDoctor = await userManager.Users
            .Include(x => x.Doctors)
            .SingleOrDefaultAsync(x => x.Email == requestingDoctorEmail);
        if (requestingDoctor == null) return BadRequest("Doctor solicitante no encontrado.");

        if (nurse != null)
        {
            if (string.IsNullOrEmpty(nurse.Email))
                return BadRequest($"Email del especialista con ID {nurse.Id} es requerido.");
            if (nurse.Email == requestingDoctorEmail)
                return BadRequest("No puedes agregar tu propio email como especialista.");
            if (nurse.Doctors.Any(x => x.DoctorId == User.GetUserId()))
                return BadRequest($"El especialista con email {request.Email} ya está registrado.");

            requestingDoctor.DoctorNurses.Add(new DoctorNurse(nurse.Id));

            var updateResult = await userManager.UpdateAsync(nurse);
            if (!updateResult.Succeeded)
                return BadRequest($"Error al agregar especialista con email {request.Email}.");
        }
        else
        {
            nurse = new AppUser
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                DateOfBirth = new DateOnly(request.DateOfBirth.Year, request.DateOfBirth.Month, request.DateOfBirth.Day),
                Email = request.Email,
                UserName = request.Email,
                Sex = request.Sex,
                PhoneNumber = request.PhoneNumber,
                RecommendedBy = request.RecommendedBy
            };

            var createResult = await userManager.CreateAsync(nurse, "Pa$$w0rd");
            if (!createResult.Succeeded)
                return BadRequest($"Error al crear especialista con email {request.Email}.");

            var roleResult = await userManager.AddToRoleAsync(nurse, "Nurse");
            if (!roleResult.Succeeded)
                return BadRequest($"Error al agregar especialista con email {request.Email}.");

            requestingDoctor.DoctorNurses.Add(new DoctorNurse(nurse.Id));

            var updateResult = await userManager.UpdateAsync(nurse);
            if (!updateResult.Succeeded)
                return BadRequest("Error al agregar especialista a la lista de especialistas del doctor.");
        }

        if (request.Files != null && request.Files.Count > 0)
        {
            var file = request.Files.First();
            var uploadResult = await UploadImage(file);
            if (uploadResult != null)
            {
                nurse.UserPhoto = new UserPhoto
                {
                    Photo = new Photo
                    {
                        Url = uploadResult.SecureUrl,
                        PublicId = uploadResult.PublicId,
                        Size = (int?)file.Length
                    },
                };
            }
        }

        if (uow.HasChanges() && !await uow.Complete()) return BadRequest("Error al guardar especialista.");

        return Ok(await uow.UserRepository.GetDtoByEmailAsync(request.Email));
    }

    private async Task<ImageUploadResult?> UploadImage(IFormFile file)
    {
        var fileName = Guid.NewGuid().ToString();
        var uploadParams = new ImageUploadParams
        {
            Folder = "Mediverse/Users",
            File = new FileDescription(fileName, file.OpenReadStream())
        };

        var uploadResult = await cloudinaryService.UploadAsync(file, uploadParams);
        return uploadResult.StatusCode == System.Net.HttpStatusCode.OK ? uploadResult : null;
    }
}