using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.MedicalRecord;
using MainService.Core.DTOs.User;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Interfaces.Data;
using MainService.Infrastructure.QueryExtensions;
using MainService.Models;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MainService.Infrastructure.Data;

public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
{
    public void Add(AppUser item) => context.Users.Remove(item);
    public void Delete(AppUser item) => context.Users.Remove(item);
    public void Update(AppUser item) => context.Users.Update(item);

    public async Task<List<AppUser>> GetAllAsync()
    {
        return await context.Users.ToListAsync();
    }

    public async Task<List<UserDto>> GetAllDtoAsync(UserParams param)
    {
        // TODO: Implement filtering

        var query = context.Users
            .AsNoTracking()
            .ProjectTo<UserDto>(mapper.ConfigurationProvider);

        return await query.ToListAsync();
    }

    public async Task<AppUser?> GetByIdAsNoTrackingAsync(int id) =>
        await Includes(context.Users)
            .AsQueryable()
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<AppUser?> GetByIdAsync(int id) =>
        await context.Users
            .Include(x => x.Patients).ThenInclude(x => x.Patient)
            .Include(x => x.UserAddresses).ThenInclude(x => x.Address)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<UserDto?> GetDtoByIdAsync(int id) =>
        await IncludesForUserDto(context.Users).AsQueryable()
            .ProjectTo<UserDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    private static IQueryable<AppUser> IncludesForUserDto(IQueryable<AppUser> query) =>
        query
            .AsSplitQuery()
            .AsQueryable()
            .Include(x => x.UserMedicalInsuranceCompanies)
            .ThenInclude(x => x.MedicalInsuranceCompany)
            .Include(x => x.PatientEvents)
            .ThenInclude(x => x.Event)
            .ThenInclude(x => x.Payments);

    public async Task<List<UserSummaryDto>> GetSummaryDtosAsync(UserParams param, ClaimsPrincipal user)
    {
        var query = context.Users
            .AsNoTracking()
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .Where(x => x.UserRoles.Any(x => x.Role.Name == "Patient") &&
                        x.Doctors.Any(x => x.DoctorId == user.GetUserId()))
            .AsQueryable();

        query = query.OrderBy(x => x.FirstName).ThenBy(x => x.LastName);

        if (!string.IsNullOrEmpty(param.Search))
        {
            string term = param.Search.ToLower();

            query = query.Where(
                x =>
                    !string.IsNullOrEmpty(x.FirstName) && x.FirstName.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.LastName) && x.LastName.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Sex) && x.Sex.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.PhoneNumberCountryCode) &&
                    x.PhoneNumberCountryCode.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.RecommendedBy) && x.RecommendedBy.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.RFC) && x.RFC.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.CURP) && x.CURP.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.CommercialName) && x.CommercialName.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.LegalName) && x.LegalName.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Education) && x.Education.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Post) && x.Post.ToLower().Contains(term)
            );
        }

        query = query.Take(10);

        return await query.ProjectTo<UserSummaryDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<bool> DoctorExistsAsync(int id, int doctorId)
    {
        return await context.Users
            .Include(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .Where(x => x.UserRoles.Any(x => x.Role.Name == "Doctor"))
            .AnyAsync(x => x.Id == id);
    }

    public async Task<bool> NurseExistsAsync(int id, int doctorId)
    {
        return await context.Users
            .Include(x => x.NursesDoctor)
            .Include(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .Where(x => x.UserRoles.Any(x => x.Role.Name == "Nurse"))
            .AnyAsync(x => x.Id == id && x.NursesDoctor.Any(x => x.DoctorId == doctorId));
    }

    public async Task<UserDto?> GetDtoByEmailAsync(string email) =>
        await IncludesForUserDto(context.Users)
            .AsNoTracking()
            .ProjectTo<UserDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Email == email);

    public async Task<PagedList<UserDto>> GetPagedListAsync(UserParams param, ClaimsPrincipal user)
    {
        IQueryable<AppUser> query = context.Users
            .Include(x => x.Patients)
            .Include(x => x.Doctors)
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .Include(x => x.DoctorNurses)
            .Include(x => x.UserAddresses).ThenInclude(x => x.Address)
            .Include(x => x.UserPhoto).ThenInclude(x => x.Photo)
            .AsQueryable();

        IEnumerable<string> roles = user.GetRoles();
        int userId = user.GetUserId();

        query = query.Where(x => x.Id != userId);

        if (!string.IsNullOrEmpty(param.Roles))
        {
            query = query.Where(x => x.UserRoles.Any(y => param.RoleIds.Contains(y.RoleId)));
        }

        switch (param.Role)
        {
            case Roles.Admin:
                // if (!roles.Contains("Admin")) return null;
                break;
            case Roles.Doctor:
                // if (!roles.Contains("Admin") || !roles.Contains("Patient")) return null;
                break;
            case Roles.Patient:
                // if (!roles.Contains("Doctor") && !roles.Contains("Nurse")) return null;
                if (roles.Contains("Doctor"))
                {
                    query = query.Where(x => x.UserRoles.Any(x => x.Role.Name == "Patient"));
                    query = query.Where(x => x.Doctors.Any(x => x.DoctorId == userId));
                }

                break;
            case Roles.Nurse:
                // if (!roles.Contains("Doctor")) return null;
                if (roles.Contains("Doctor"))
                {
                    int doctorId = userId;

                    query = query.Where(x => x.UserRoles.Any(x => x.Role.Name == "Nurse"));
                    query = query.Where(x => x.NursesDoctor.Any(x => x.DoctorId == doctorId));
                }

                break;
            case Roles.Staff:
                // if (!roles.Contains("Admin")) return null;
                break;
            default:
                break;
        }

        if (!string.IsNullOrEmpty(param.Sort))
        {
            query = param.Sort.ToLower() switch
            {
                "id" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Id)
                    : query.OrderByDescending(x => x.Id),
                "email" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Email)
                    : query.OrderByDescending(x => x.Email),
                "username" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.UserName)
                    : query.OrderByDescending(x => x.UserName),
                "firstname" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.FirstName)
                    : query.OrderByDescending(x => x.FirstName),
                "lastname" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.LastName)
                    : query.OrderByDescending(x => x.LastName),
                "sex" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Sex)
                    : query.OrderByDescending(x => x.Sex),
                "dateofbirth" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.DateOfBirth)
                    : query.OrderByDescending(x => x.DateOfBirth),
                "lastactive" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.LastActive)
                    : query.OrderByDescending(x => x.LastActive),
                "phonenumbercountrycode" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.PhoneNumberCountryCode)
                    : query.OrderByDescending(x => x.PhoneNumberCountryCode),
                "phonenumber" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.PhoneNumber)
                    : query.OrderByDescending(x => x.PhoneNumber),
                "emailverificationexpirytime" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.EmailVerificationExpiryTime)
                    : query.OrderByDescending(x => x.EmailVerificationExpiryTime),
                "phonenumberverificationexpirytime" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.PhoneNumberVerificationExpiryTime)
                    : query.OrderByDescending(x => x.PhoneNumberVerificationExpiryTime),
                "stripecustomerid" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.StripeCustomerId)
                    : query.OrderByDescending(x => x.StripeCustomerId),
                "recommendedby" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.RecommendedBy)
                    : query.OrderByDescending(x => x.RecommendedBy),
                "rfc" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.RFC)
                    : query.OrderByDescending(x => x.RFC),
                "curp" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.CURP)
                    : query.OrderByDescending(x => x.CURP),
                "legalname" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.LegalName)
                    : query.OrderByDescending(x => x.LegalName),
                "education" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Education)
                    : query.OrderByDescending(x => x.Education),
                "post" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Post)
                    : query.OrderByDescending(x => x.Post),
                "stripeconnectaccountid" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.StripeConnectAccountId)
                    : query.OrderByDescending(x => x.StripeConnectAccountId),
                "requireanticipatedcardpayments" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.RequireAnticipatedCardPayments)
                    : query.OrderByDescending(x => x.RequireAnticipatedCardPayments),
                "createdat" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.CreatedAt)
                    : query.OrderByDescending(x => x.CreatedAt),
                _ => query.OrderByDescending(x => x.CreatedAt),
            };
        }
        else
        {
            query = query.OrderByDescending(x => x.CreatedAt);
        }

        if (!string.IsNullOrEmpty(param.Search))
        {
            string term = param.Search.ToLower();

            query = query.Where(
                x =>
                    !string.IsNullOrEmpty(x.FirstName) && x.FirstName.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.LastName) && x.LastName.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Sex) && x.Sex.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.PhoneNumberCountryCode) &&
                    x.PhoneNumberCountryCode.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.RecommendedBy) && x.RecommendedBy.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.RFC) && x.RFC.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.CURP) && x.CURP.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.CommercialName) && x.CommercialName.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.LegalName) && x.LegalName.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Education) && x.Education.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Post) && x.Post.ToLower().Contains(term)
            );
        }

        return await PagedList<UserDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<UserDto>(mapper.ConfigurationProvider),
            param.PageNumber, param.PageSize);
    }

    public async Task<List<PaymentMethodTypeDto>> GetPaymentMethodTypesAsync()
    {
        return await context.PaymentMethodTypes
            .ProjectTo<PaymentMethodTypeDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<List<SpecialtyDto>> GetSpecialtiesAsync()
    {
        return await context.Specialties
            .ProjectTo<SpecialtyDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public Task<List<MedicalInsuranceCompanyDto>> GetMedicalInsuranceCompaniesAsync()
    {
        return context.MedicalInsuranceCompanies
            .ProjectTo<MedicalInsuranceCompanyDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<bool> DeleteDoctorWorkScheduleAsync(WorkSchedule workSchedule)
    {
        context.WorkSchedules.Remove(workSchedule);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteDoctorWorkScheduleSettingsAsync(WorkScheduleSettings workScheduleSettings)
    {
        context.WorkScheduleSettings.Remove(workScheduleSettings);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteMedicalRecordAsync(UserMedicalRecord userMedicalRecord)
    {
        var medicalRecord = userMedicalRecord.MedicalRecord;

        var relativeTypes = medicalRecord.MedicalRecordFamilyMembers
            .Select(x => x.FamilyMember.MedicalRecordFamilyMemberRelativeType)
            .Where(rt => rt != null);
        context.MedicalRecordFamilyMemberRelativeTypes.RemoveRange(relativeTypes);

        context.MedicalRecordFamilyMembers.RemoveRange(medicalRecord.MedicalRecordFamilyMembers);
        context.MedicalRecordPersonalDiseases.RemoveRange(medicalRecord.MedicalRecordPersonalDiseases);
        context.MedicalRecordFamilyDiseases.RemoveRange(medicalRecord.MedicalRecordFamilyDiseases);
        context.MedicalRecordSubstances.RemoveRange(medicalRecord.MedicalRecordSubstances);

        if (medicalRecord.MedicalRecordCompanion is { } companion)
        {
            if (companion.Companion.CompanionRelativeType is { } relativeType)
            {
                context.CompanionRelativeTypes.Remove(relativeType);
            }

            context.MedicalRecordCompanions.Remove(companion);
        }

        context.UserMedicalRecords.Remove(userMedicalRecord);

        try
        {
            return await context.SaveChangesAsync() > 0;
        }
        catch (DbUpdateException ex)
        {
            Log.Error(ex, "Error deleting medical record");
            return false;
        }
    }

    public async Task<MedicalRecordDto?> GetMedicalRecordDtoAsync(int userId)
    {
        var user = await context.Users
            .IncludeMedicalRecordProperties()
            .IncludeMedicalInsuranceProperties()
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null || user.UserMedicalRecord == null) return null;

        var itemToReturn = mapper.Map<MedicalRecordDto>(user.UserMedicalRecord.MedicalRecord);

        return itemToReturn;
    }

    public async Task<bool> AddReviewAsync(Review review)
    {
        await context.Reviews.AddAsync(review);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> ExistsByIdAsync(int id) => await context.Users.AnyAsync(x => x.Id == id);

    public async Task<bool> HasDoctorRoleByIdAsync(int id) =>
        await IncludeRoles(context.Users).AnyAsync(x => x.Id == id && x.UserRoles.Any(x => x.Role.Name == "Doctor"));

    private static IQueryable<AppUser> IncludeRoles(IQueryable<AppUser> query) =>
        query
            .Include(x => x.UserRoles)
            .ThenInclude(x => x.Role);

    public async Task<bool> RequireAnticipatedCardPaymentsByIdAsync(int id) =>
        await context.Users.AnyAsync(x => x.Id == id && x.RequireAnticipatedCardPayments == true);

    private static IQueryable<AppUser> Includes(IQueryable<AppUser> query) =>
        query
            .AsSplitQuery()
            .AsQueryable()
            .Include(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .Include(x => x.UserAddresses)
            .ThenInclude(x => x.Address)
            .Include(x => x.Patients)
            .Include(x => x.DoctorSpecialty).ThenInclude(x => x.Specialty)
            .Include(x => x.Doctors);

    public async Task<ClinicalHistoryVerificationDto?> GetClinicalHistoryVerificationAsync(int doctorId, int patientId)
    {
        var dpRecord = await context.DoctorPatients
            .AsNoTracking()
            .FirstOrDefaultAsync(dp => dp.DoctorId == doctorId && dp.PatientId == patientId);

        if (dpRecord == null)
        {
            return null;
        }

        return new ClinicalHistoryVerificationDto
        {
            HasAccess = dpRecord.HasClinicalHistoryAccess,
            ConsentGrantedAt = dpRecord.ConsentGrantedAt
        };
    }

    public async Task<int?> GetMainAddressIdAsync(int userId) =>
        await context.UserAddresses
            .Where(x => x.UserId == userId && x.IsMain)
            .Select(x => x.AddressId)
            .SingleOrDefaultAsync();

    public async Task<List<OptionDto>> GetPatientOptionsForDoctorAsync(UserParams param)
    {
        IQueryable<AppUser> query = Includes(context.Users).AsQueryable();

        if (param.DoctorId.HasValue)
        {
            query = query.Where(x => x.Doctors.Any(x => x.DoctorId == param.DoctorId));
        }

        return await query
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }
}