using AutoMapper;
using MainService.Core.DTOs.User;
using MainService.Core.Interfaces.Services;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MainService.Infrastructure.Services;

public class UsersService(
    IUnitOfWork uow,
    UserManager<AppUser> userManager,
    ICloudinaryService cloudinaryService,
    IMapper mapper,
    ITokenService tokenService,
    DataContext context) : IUsersService
{
    public async Task<bool> DeleteAsync(AppUser item)
    {
        if (!await DeleteUserPhotoAsync(item)) return false;

        var itemToDelete = await userManager.Users
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
        var user = await Includes(userManager.Users)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return null;

        var itemToReturn = mapper.Map<AppUser, AccountDto>(user);

        itemToReturn.LinkedEmail = !string.IsNullOrEmpty(user.PasswordHash);
        itemToReturn.LinkedGoogle = userManager.GetLoginsAsync(user).Result.Any(x => x.LoginProvider == "GOOGLE");

        itemToReturn.Token = await tokenService.CreateToken(user);

        itemToReturn.SharedDoctors = user.Doctors
            .Where(d => d.HasClinicalHistoryAccess)
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
            Log.Warning(
                $"La foto de perfil con ID {photo.Id} no pudo ser eliminada de Cloudinary. Resultado: {deleteResult.Result}.");

        uow.PhotoRepository.Delete(photo);

        if (!await uow.Complete()) return false;

        return true;
    }

    private async Task<bool> DeleteFromRolesAsync(AppUser user)
    {
        var count = user.UserRoles.Count();

        if (count == 0) return true;

        List<string> roles = count > 1 ? user.UserRoles.Select(x => x.Role.Name!).ToList() : [];

        var roleDeleteResult = await userManager.RemoveFromRolesAsync(user, roles);

        if (!roleDeleteResult.Succeeded) return false;

        return true;
    }

    public async Task<bool> PhoneExistsAsync(string phoneNumber) =>
        await userManager.Users.AnyAsync(x => x.PhoneNumber == phoneNumber);

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
        var user = await userManager.Users
            .Include(x => x.PaymentMethods)
            .Include(x => x.UserAddresses).ThenInclude(x => x.Address)
            .SingleOrDefaultAsync(x => x.Id == userId);

        return user == null ? null : mapper.Map<AppUser, BillingDetailsDto>(user);
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
        var user = await context.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return false;

        context.Attach(user);

        user.StripeConnectAccountId = stripeConnectAccountId;

        var result = await userManager.UpdateAsync(user);

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
            .Include(x => x.DoctorSpecialty)
            .ThenInclude(x => x.Specialty)
            .Include(x => x.UserPhoto.Photo)
            .Include(x => x.DoctorBannerPhoto.Photo)
            .Include(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .Include(x => x.UserPermissions)
            .ThenInclude(x => x.Permission)
            .Include(x => x.UserMedicalLicenses)
            .ThenInclude(x => x.MedicalLicense.MedicalLicenseSpecialty.Specialty)
            .Include(x => x.UserMedicalLicenses)
            .ThenInclude(x => x.MedicalLicense.MedicalLicenseDocument.Document)
            .Include(x => x.UserAddresses)
            .ThenInclude(x => x.Address)
            .Include(x => x.DoctorPaymentMethodTypes)
            .ThenInclude(x => x.PaymentMethodType)
            .Include(x => x.DoctorWorkSchedules)
            .ThenInclude(x => x.WorkSchedule)
            .Include(x => x.DoctorWorkScheduleSettings)
            .ThenInclude(x => x.WorkScheduleSettings)
            .Include(x => x.DoctorClinics)
            .ThenInclude(x => x.Clinic)
            .ThenInclude(x => x.ClinicLogo)
            .ThenInclude(x => x.Photo)
            .Include(x => x.Doctors)
            .ThenInclude(x => x.Doctor)
            .ThenInclude(x => x.UserMedicalLicenses)
            .ThenInclude(x => x.MedicalLicense)
            .ThenInclude(x => x.MedicalLicenseSpecialty)
            .ThenInclude(x => x.Specialty);

    public async Task<ClinicalHistoryVerificationDto?> VerifyClinicalHistoryAccessAsync(int doctorId, int patientId)
    {
        if (!await uow.UserRepository.ExistsByIdAsync(doctorId) || !await uow.UserRepository.ExistsByIdAsync(patientId))
        {
            return null;
        }

        return await uow.UserRepository.GetClinicalHistoryVerificationAsync(doctorId, patientId);
    }

    public async Task<ClinicalHistoryVerificationDto?> UpdateClinicalHistoryConsentAsync(int doctorId, int patientId,
        bool consent)
    {
        if (!await uow.UserRepository.ExistsByIdAsync(doctorId) ||
            !await uow.UserRepository.ExistsByIdAsync(patientId))
        {
            return null;
        }

        var dpRecord = await context.DoctorPatients
            .FirstOrDefaultAsync(dp => dp.DoctorId == doctorId && dp.PatientId == patientId);

        if (dpRecord == null)
        {
            if (consent)
            {
                dpRecord = new DoctorPatient(doctorId, patientId)
                {
                    HasClinicalHistoryAccess = true,
                    ConsentGrantedAt = DateTime.UtcNow
                };
                context.DoctorPatients.Add(dpRecord);
            }
            else
            {
                return null;
            }
        }
        else
        {
            dpRecord.HasClinicalHistoryAccess = consent;
            dpRecord.ConsentGrantedAt = consent ? DateTime.UtcNow : null;
        }

        await context.SaveChangesAsync();

        return new ClinicalHistoryVerificationDto
        {
            HasAccess = dpRecord.HasClinicalHistoryAccess,
            ConsentGrantedAt = dpRecord.ConsentGrantedAt
        };
    }

    public async Task<bool> AddPatientToDoctorAsync(int doctorId, int patientId)
    {
        if (await uow.UserRepository.ExistsByIdAsync(patientId) == false) return false;

        if (await uow.UserRepository.ExistsByIdAsync(doctorId) == false) return false;

        if (await DoesPatientBelongToDoctorAsync(doctorId, patientId)) return true;

        DoctorPatient itemToAdd = new(doctorId, patientId);

        context.DoctorPatients.Add(itemToAdd);

        if (!(await context.SaveChangesAsync() > 0)) return false;

        return true;
    }

    private async Task<bool> DoesPatientBelongToDoctorAsync(int doctorId, int patientId) =>
        await context.Users
            .AsNoTracking()
            .Include(x => x.Patients)
            .AnyAsync(x => x.Id == doctorId && x.Patients.Any(p => p.PatientId == patientId));
}