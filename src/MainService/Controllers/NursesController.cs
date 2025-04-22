using System.Globalization;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using MainService.Authorization.Operations;
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
using Serilog;

namespace MainService.Controllers;

[Authorize(Roles = "Doctor, Admin")]
public class NursesController(
    IUnitOfWork uow,
    UserManager<AppUser> userManager,
    IMapper mapper,
    IUsersService service,
    ICloudinaryService cloudinaryService,
    IAuthorizationService authorizationService,
    ILogger<NursesController> logger
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

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateAsync([FromForm] NurseCreateDto request)
    {
        var createAuthResult = await authorizationService.AuthorizeAsync(User, null, NurseOperations.CreateAssociation);
        if (!createAuthResult.Succeeded)
        {
            Log.Warning("CreateAsync Nurse: Forbidden attempt by User {UserId}. Missing CreateAssociation permission.", User.GetUserId());
            return Forbid();
        }


        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (request.Files != null && request.Files.Count > 1)
        {
            return BadRequest("Solo puedes subir una foto de perfil.");
        }


        var requestingDoctorId = User.GetUserId();
        var requestingDoctorEmail = User.GetEmail();

        if (requestingDoctorId <= 0 || string.IsNullOrEmpty(requestingDoctorEmail))
        {
            Log.Error("CreateAsync Nurse: Invalid requesting user state - ID: {UserId}, Email: {Email}", requestingDoctorId, requestingDoctorEmail);
            return BadRequest("Información del doctor solicitante inválida.");
        }


        var requestingDoctor = await userManager.Users
            .Include(u => u.DoctorNurses)
            .SingleOrDefaultAsync(x => x.Id == requestingDoctorId);

        if (requestingDoctor == null)
        {
            Log.Error("CreateAsync Nurse: Requesting doctor (ID: {DoctorId}) not found in DB despite claims.", requestingDoctorId);
            return BadRequest("Doctor solicitante no encontrado.");
        }

        if (request.Email == requestingDoctorEmail)
        {
            Log.Warning("CreateAsync Nurse: Doctor {DoctorId} attempted to add themselves.", requestingDoctorId);
            return BadRequest("No puedes agregarte a ti mismo como especialista.");
        }


        var nurse = await userManager.Users
            .Include(x => x.Doctors)
            .Include(x => x.UserPhoto).ThenInclude(p => p.Photo)
            .SingleOrDefaultAsync(x => x.Email == request.Email);

        bool isNewUser = false;

        if (nurse != null)
        {
            if (nurse.Doctors.Any(dp => dp.DoctorId == requestingDoctorId))
            {
                Log.Warning(
                    "CreateAsync Nurse: Nurse {NurseEmail} (ID: {NurseId}) is already associated with Doctor {DoctorId}.",
                    request.Email, nurse.Id, requestingDoctorId);
                return BadRequest($"El especialista con email {request.Email} ya está registrado contigo.");
            }

            if (!await userManager.IsInRoleAsync(nurse, "Nurse"))
            {
                Log.Information("CreateAsync Nurse: Found user {NurseEmail} (ID: {NurseId}) but they lack 'Nurse' role. Adding role.",
                    request.Email, nurse.Id);
                var addRoleResult = await userManager.AddToRoleAsync(nurse, "Nurse");
                if (!addRoleResult.Succeeded)
                {
                    Log.Error("CreateAsync Nurse: Failed to add 'Nurse' role to existing user {NurseEmail} (ID: {NurseId}). Errors: {@Errors}",
                        request.Email, nurse.Id, addRoleResult.Errors);
                    return BadRequest($"Error al asignar rol de especialista al usuario existente con email {request.Email}.");
                }
            }
        }
        else
        {
            isNewUser = true;
            nurse = mapper.Map<AppUser>(request);
            if (DateTime.TryParse(request.DateOfBirth.ToString(CultureInfo.InvariantCulture), out var dob))
            {
                nurse.DateOfBirth = DateOnly.FromDateTime(dob);
            }
            else
            {
                Log.Warning("CreateAsync Nurse: Invalid DateOfBirth format provided: {DateOfBirth}", request.DateOfBirth);
                ModelState.AddModelError(nameof(request.DateOfBirth), "Formato de fecha de nacimiento inválido.");
                return BadRequest(ModelState);
            }

            nurse.UserName = request.Email;


            var createResult = await userManager.CreateAsync(nurse, "Pa$$w0rd");
            if (!createResult.Succeeded)
            {
                Log.Error("CreateAsync Nurse: Failed to create new user for email {Email}. Errors: {@Errors}", request.Email, createResult.Errors);
                return BadRequest($"Error al crear especialista con email {request.Email}: {string.Join(", ", createResult.Errors.Select(e => e.Description))}");
            }

            var roleResult = await userManager.AddToRoleAsync(nurse, "Nurse");
            if (!roleResult.Succeeded)
            {
                Log.Error("CreateAsync Nurse: Failed to add 'Nurse' role to newly created user {Email} (ID: {NurseId}). Errors: {@Errors}", request.Email, nurse.Id, roleResult.Errors);
                return BadRequest($"Error al agregar rol de especialista al nuevo usuario con email {request.Email}.");
            }

            Log.Information("CreateAsync Nurse: Successfully created new Nurse user {Email} (ID: {NurseId}).", request.Email, nurse.Id);
        }


        requestingDoctor.DoctorNurses.Add(new DoctorNurse(nurse.Id));


        bool photoUpdated = false;
        if (request.Files != null && request.Files.Count == 1)
        {
            var file = request.Files.First();
            try
            {
                if (nurse.UserPhoto?.Photo != null && !string.IsNullOrEmpty(nurse.UserPhoto.Photo.PublicId))
                {
                    Log.Information("CreateAsync Nurse: Deleting existing photo {PublicId} for Nurse {NurseId} before uploading new one.", nurse.UserPhoto.Photo.PublicId, nurse.Id);
                    await cloudinaryService.DeleteAsync(nurse.UserPhoto.Photo.PublicId);
                    uow.PhotoRepository.Delete(nurse.UserPhoto.Photo);
                    nurse.UserPhoto = null;
                    await uow.Complete();
                }

                var uploadResult = await UploadImage(file);
                if (uploadResult != null)
                {
                    var newPhoto = new Photo
                    {
                        Url = uploadResult.SecureUrl,
                        PublicId = uploadResult.PublicId,
                        Size = (int?)file.Length
                    };

                    nurse.UserPhoto = new UserPhoto { Photo = newPhoto };

                    photoUpdated = true;
                }
                else
                {
                    Log.Warning("CreateAsync Nurse: Photo upload failed for Nurse {NurseId}, proceeding without photo update.", nurse.Id);
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex, "CreateAsync Nurse: Exception during photo handling for Nurse {NurseId}.", nurse.Id);
            }
        }


        var doctorUpdateResult = await userManager.UpdateAsync(requestingDoctor);
        if (!doctorUpdateResult.Succeeded)
        {
            Log.Error("CreateAsync Nurse: Failed to update requesting Doctor {DoctorId} after adding nurse association. Errors: {@Errors}", requestingDoctorId, doctorUpdateResult.Errors);
            return BadRequest("Error al actualizar la información del doctor después de agregar al especialista.");
        }


        if (isNewUser || photoUpdated || !(await userManager.IsInRoleAsync(nurse, "Nurse")))
        {
            var nurseUpdateResult = await userManager.UpdateAsync(nurse);
            if (!nurseUpdateResult.Succeeded)
            {
                Log.Error("CreateAsync Nurse: Failed to update Nurse user {NurseId} (Email: {Email}). Errors: {@Errors}", nurse.Id, nurse.Email, nurseUpdateResult.Errors);
                return BadRequest("Error al actualizar la información del especialista.");
            }
        }


        if (uow.HasChanges())
        {
            if (!await uow.Complete())
            {
                Log.Error("CreateAsync Nurse: Final UoW save failed after associating Nurse {NurseId} with Doctor {DoctorId}.", nurse.Id, requestingDoctorId);
                return BadRequest("Error final al guardar los cambios del especialista.");
            }
        }


        Log.Information("CreateAsync Nurse: Successfully associated Nurse {NurseId} with Doctor {DoctorId}.", nurse.Id, requestingDoctorId);

        var nurseDto = await uow.UserRepository.GetDtoByIdAsync(nurse.Id);
        if (nurseDto == null)
        {
            Log.Error("CreateAsync Nurse: Failed to retrieve DTO for associated Nurse {NurseId} after successful operation.",
                nurse.Id);

            return BadRequest("Especialista asociado correctamente, pero no se pudieron recuperar los detalles actualizados.");
        }

        return Ok(nurseDto);
    }


    private async Task<ImageUploadResult?> UploadImage(IFormFile file)
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
            else
            {
                Log.Error("UploadImage: Cloudinary upload failed for file {OriginalFileName}. Status: {StatusCode}, Error: {ErrorMessage}", file.FileName, uploadResult.StatusCode, uploadResult.Error?.Message ?? "N/A");
                return null;
            }
        }
        catch (Exception ex)
        {
            Log.Error(ex, "UploadImage: Exception occurred during Cloudinary upload for file {OriginalFileName}", file.FileName);
            throw;
        }
    }
}