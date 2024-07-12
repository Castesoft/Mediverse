using AutoMapper;
using MainService.Core.DTOs.User;
using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MainService.Infrastructure.Services;
public class UsersService(IUnitOfWork uow, UserManager<AppUser> userManager, ICloudinaryService cloudinaryService, IMapper mapper, ITokenService tokenService) : IUsersService
{
    public async Task<bool> DeleteAsync(AppUser item)
    {
        if (!await DeleteUserPhotoAsync(item)) return false;

        var itemToDelete = await userManager.Users
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .Include(x => x.UserPhoto).ThenInclude(x => x.Photo)
            .SingleOrDefaultAsync(x => x.Id == item.Id);

        if (!await DeleteFromRolesAsync(itemToDelete)) return false;

        var result = await userManager.DeleteAsync(itemToDelete);

        if (!result.Succeeded) return false;

        return true;
    }

    public async Task<AccountDto> GenerateAccountDtoAsync(int userId)
    {
        var user = await userManager.Users
            .Include(x => x.UserPhoto).ThenInclude(x => x.Photo)
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .Include(x => x.UserPermissions).ThenInclude(x => x.Permission)
            .SingleOrDefaultAsync(x => x.Id == userId);

        var accountToReturn = mapper.Map<AppUser, AccountDto>(user);

        accountToReturn.Token = await tokenService.CreateToken(user);

        return accountToReturn;
    }

    private async Task<bool> DeleteUserPhotoAsync(AppUser user)
    {
        if (user.UserPhoto == null) return true;

        var photo = await uow.PhotoRepository.GetByIdAsync(user.UserPhoto.PhotoId);

        if (photo == null) return true;

        if (string.IsNullOrEmpty(photo.PublicId)) return true;

        var deleteResult = await cloudinaryService.Delete(photo.PublicId);

        if (deleteResult.Result != "ok")
            Log.Warning($"La foto de perfil con ID {photo.Id} no pudo ser eliminada de Cloudinary. Resultado: {deleteResult.Result}.");

        uow.PhotoRepository.Delete(photo);

        if (!await uow.Complete()) return false;

        return true;
    }

    private async Task<bool> DeleteFromRolesAsync(AppUser user)
    {
        if (user.UserRoles.Count() == 0) return true;

        var roles = user.UserRoles.Select(x => x.Role.Name).ToList();

        var roleDeleteResult = await userManager.RemoveFromRolesAsync(user, roles);

        if (!roleDeleteResult.Succeeded) return false;

        return true;
    }

    public async Task<bool> PhoneExistsAsync(string phoneNumber) => await userManager.Users.AnyAsync(x => x.PhoneNumber == phoneNumber);
    public async Task<bool> EmailExistsAsync(string email) => await userManager.Users.AnyAsync(x => x.Email == email);
}