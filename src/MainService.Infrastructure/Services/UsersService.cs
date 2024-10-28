#nullable enable

using AutoMapper;
using MainService.Core.DTOs.User;
using MainService.Core.Interfaces.Services;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MainService.Infrastructure.Services;
public class UsersService(IUnitOfWork uow, UserManager<AppUser> userManager, ICloudinaryService cloudinaryService, IMapper mapper, ITokenService tokenService, DataContext context) : IUsersService
{
    public async Task<bool> DeleteAsync(AppUser item)
    {
        if (!await DeleteUserPhotoAsync(item)) return false;

        AppUser? itemToDelete = await userManager.Users
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .Include(x => x.UserPhoto).ThenInclude(x => x.Photo)
            .SingleOrDefaultAsync(x => x.Id == item.Id);

        if (itemToDelete == null) return false;

        if (!await DeleteFromRolesAsync(itemToDelete)) return false;

        var result = await userManager.DeleteAsync(itemToDelete);

        if (!result.Succeeded) return false;

        return true;
    }

    public async Task<AccountDto?> GenerateAccountDtoAsync(int userId)
    {
        AppUser? user = await Includes(userManager.Users)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return null;

        AccountDto itemToReturn = mapper.Map<AppUser, AccountDto>(user);

        itemToReturn.LinkedEmail = !string.IsNullOrEmpty(user.PasswordHash);
        itemToReturn.LinkedGoogle = userManager.GetLoginsAsync(user).Result.Any(x => x.LoginProvider == "GOOGLE");

        itemToReturn.Token = await tokenService.CreateToken(user);

        itemToReturn.SharedDoctors = user.Doctors
            .Where(d => d.HasPatientInformationAccess)
            .Select(mapper.Map<DoctorDto>)
            .ToList();

        return itemToReturn;
    }

    private async Task<bool> DeleteUserPhotoAsync(AppUser user)
    {
        if (user.UserPhoto == null) return true;

        var photo = await uow.PhotoRepository.GetByIdAsync(user.UserPhoto.PhotoId);

        if (photo == null) return true;

        if (string.IsNullOrEmpty(photo.PublicId)) return true;

        var deleteResult = await cloudinaryService.DeleteAsync(photo.PublicId);

        if (deleteResult.Result != "ok")
            Log.Warning($"La foto de perfil con ID {photo.Id} no pudo ser eliminada de Cloudinary. Resultado: {deleteResult.Result}.");

        uow.PhotoRepository.Delete(photo);

        if (!await uow.Complete()) return false;

        return true;
    }

    private async Task<bool> DeleteFromRolesAsync(AppUser user)
    {
        int count = user.UserRoles.Count();
        
        if (count == 0) return true;

        List<string> roles = count > 1 ? user.UserRoles.Select(x => x.Role.Name!).ToList() : [];

        var roleDeleteResult = await userManager.RemoveFromRolesAsync(user, roles);

        if (!roleDeleteResult.Succeeded) return false;

        return true;
    }

    public async Task<bool> PhoneExistsAsync(string phoneNumber) => await userManager.Users.AnyAsync(x => x.PhoneNumber == phoneNumber);
    public async Task<bool> EmailExistsAsync(string email) => await userManager.Users.AnyAsync(x => x.Email == email);

    
    public async Task<List<PaymentMethodTypeDto>> GetPaymentMethodTypesAsync()
    {
        return await uow.UserRepository.GetPaymentMethodTypesAsync();
    }

    public async Task<List<SpecialtyDto>> GetSpecialtiesAsync()
    {
        return await uow.UserRepository.GetSpecialtiesAsync();
    }

    public async Task<BillingDetailsDto?> GetBillingDetailsAsync(int userId)
    {
        AppUser? user = await userManager.Users
            .Include(x => x.UserPaymentMethods).ThenInclude(x => x.PaymentMethod)
            .Include(x => x.UserAddresses).ThenInclude(x => x.Address)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return null;

        return mapper.Map<AppUser, BillingDetailsDto>(user);
    }

    public Task<int> GetSpecialistsQuantityAsync()
    {
        var specialists = userManager.Users
            .Include(x => x.UserMedicalLicenses)
            .Where(x => x.UserMedicalLicenses.Count != 0);

        return specialists.CountAsync();
    }

    public async Task<bool> UpdateStripeConnectAccountId(int userId, string stripeConnectAccountId)
    {
        AppUser? user = await context.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return false;

        context.Attach(user);

        user.StripeConnectAccountId = stripeConnectAccountId;

        IdentityResult result = await userManager.UpdateAsync(user);

        if (!result.Succeeded) return false;

        context.Entry(user).State = EntityState.Detached;

        return true;
    }

    private static IQueryable<AppUser> Includes(IQueryable<AppUser> query) =>
        query
            .AsSplitQuery()

            .Include(x => x.UserMedicalInsuranceCompanies)
                .ThenInclude(x => x.MedicalInsuranceCompany.MedicalInsuranceCompanyPhoto.Photo)
            .Include(x => x.UserMedicalInsuranceCompanies)
                .ThenInclude(x => x.Document)

            .Include(x => x.DoctorMedicalInsuranceCompanies)
                .ThenInclude(x => x.MedicalInsuranceCompany.MedicalInsuranceCompanyPhoto.Photo)
            
            .Include(x => x.UserPhoto.Photo)
            .Include(x => x.DoctorBannerPhoto.Photo)
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .Include(x => x.UserPermissions).ThenInclude(x => x.Permission)
            .Include(x => x.UserMedicalLicenses)
                .ThenInclude(x => x.MedicalLicense.MedicalLicenseSpecialty.Specialty)
            .Include(x => x.UserMedicalLicenses)
                .ThenInclude(x => x.MedicalLicense.MedicalLicenseDocument.Document)
            .Include(x => x.UserAddresses).ThenInclude(x => x.Address)
            .Include(x => x.DoctorPaymentMethodTypes).ThenInclude(x => x.PaymentMethodType)
            .Include(x => x.DoctorWorkSchedules).ThenInclude(x => x.WorkSchedule)
            .Include(x => x.DoctorWorkScheduleSettings).ThenInclude(x => x.WorkScheduleSettings)
            .Include(x => x.DoctorClinics).ThenInclude(x => x.Clinic).ThenInclude(x => x.ClinicLogo).ThenInclude(x => x.Photo)
            .Include(x => x.Doctors).ThenInclude(x => x.Doctor).ThenInclude(x => x.UserMedicalLicenses).ThenInclude(x => x.MedicalLicense).ThenInclude(x => x.MedicalLicenseSpecialty).ThenInclude(x => x.Specialty)
        ;

    public async Task<bool> AddPatientToDoctorAsync(int doctorId, int patientId)
    {
        if (await uow.UserRepository.UserExistsByIdAsync(patientId) == false) return false;

        if (await uow.UserRepository.UserExistsByIdAsync(doctorId) == false) return false;
        
        if (await DoesPatientBelongToDoctorAsync(doctorId, patientId)) return true;

        DoctorPatient itemToAdd = new (doctorId, patientId);

        context.DoctorPatients.Add(itemToAdd);

        if (await context.SaveChangesAsync() > 0) return false;

        return true;
    }

    private async Task<bool> DoesPatientBelongToDoctorAsync(int doctorId, int patientId) =>
        await context.Users
            .AsNoTracking()
            .Include(x => x.Patients)
            .AnyAsync(x => x.Id == doctorId && x.Patients.Any(p => p.PatientId == patientId));
}
