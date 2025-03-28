using MainService.Core.Helpers.Params;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.QueryExtensions;

public static class UserQueryExtensions
{
    public static IQueryable<AppUser> ApplyIncludes(this IQueryable<AppUser> query) =>
        query
            .AsSplitQuery()
            .IncludeDoctorSpecialty()
            .IncludeUserMedicalInsurance()
            .IncludeDoctorMedicalInsurance()
            .IncludeUserPhotos()
            .IncludeRolesAndPermissions()
            .IncludeMedicalLicenses()
            .IncludeAddresses()
            .IncludePaymentMethods()
            .IncludeWorkSchedules()
            .IncludeClinics()
            .IncludeDoctorAssociations();

    public static IQueryable<AppUser> IncludeDoctorSpecialty(this IQueryable<AppUser> query) =>
        query.Include(x => x.DoctorSpecialty.Specialty);

    public static IQueryable<AppUser> IncludeUserMedicalInsurance(this IQueryable<AppUser> query) =>
        query
            .Include(x => x.UserMedicalInsuranceCompanies)
            .ThenInclude(x => x.MedicalInsuranceCompany.MedicalInsuranceCompanyPhoto.Photo)
            .Include(x => x.UserMedicalInsuranceCompanies)
            .ThenInclude(x => x.Document);

    public static IQueryable<AppUser> IncludeDoctorMedicalInsurance(this IQueryable<AppUser> query) =>
        query.Include(x => x.DoctorMedicalInsuranceCompanies)
            .ThenInclude(x => x.MedicalInsuranceCompany.MedicalInsuranceCompanyPhoto.Photo);

    public static IQueryable<AppUser> IncludeUserPhotos(this IQueryable<AppUser> query) =>
        query
            .Include(x => x.UserPhoto.Photo)
            .Include(x => x.DoctorBannerPhoto.Photo);

    public static IQueryable<AppUser> IncludeRolesAndPermissions(this IQueryable<AppUser> query) =>
        query
            .Include(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .Include(x => x.UserPermissions)
            .ThenInclude(x => x.Permission);

    public static IQueryable<AppUser> IncludeMedicalLicenses(this IQueryable<AppUser> query) =>
        query
            .Include(x => x.UserMedicalLicenses)
            .ThenInclude(x => x.MedicalLicense.MedicalLicenseSpecialty.Specialty)
            .Include(x => x.UserMedicalLicenses)
            .ThenInclude(x => x.MedicalLicense.MedicalLicenseDocument.Document);

    public static IQueryable<AppUser> IncludeAddresses(this IQueryable<AppUser> query) =>
        query.Include(x => x.UserAddresses)
            .ThenInclude(x => x.Address);

    public static IQueryable<AppUser> IncludePaymentMethods(this IQueryable<AppUser> query) =>
        query.Include(x => x.DoctorPaymentMethodTypes)
            .ThenInclude(x => x.PaymentMethodType);

    public static IQueryable<AppUser> IncludeWorkSchedules(this IQueryable<AppUser> query) =>
        query
            .Include(x => x.DoctorWorkSchedules)
            .ThenInclude(x => x.WorkSchedule)
            .Include(x => x.DoctorWorkScheduleSettings)
            .ThenInclude(x => x.WorkScheduleSettings);

    public static IQueryable<AppUser> IncludeClinics(this IQueryable<AppUser> query) =>
        query.Include(x => x.DoctorClinics)
            .ThenInclude(x => x.Clinic)
            .ThenInclude(x => x.ClinicLogo)
            .ThenInclude(x => x.Photo);

    public static IQueryable<AppUser> IncludeDoctorAssociations(this IQueryable<AppUser> query) =>
        query.Include(x => x.Doctors)
            .ThenInclude(x => x.Doctor)
            .ThenInclude(x => x.UserMedicalLicenses)
            .ThenInclude(x => x.MedicalLicense)
            .ThenInclude(x => x.MedicalLicenseSpecialty)
            .ThenInclude(x => x.Specialty);

    public static IQueryable<AppUser> IncludeMedicalRecordProperties(this IQueryable<AppUser> query)
    {
        return query
            .AsSplitQuery()
            .Include(x => x.UserMedicalRecord)
            .ThenInclude(userMedicalRecord => userMedicalRecord.MedicalRecord)
            .IncludeMedicalRecordDetails();
    }

    private static IQueryable<AppUser> IncludeMedicalRecordDetails(this IQueryable<AppUser> query)
    {
        return query
            .Include(x => x.UserMedicalRecord.MedicalRecord.MedicalRecordFamilyMembers)
            .ThenInclude(x => x.FamilyMember.MedicalRecordFamilyMemberRelativeType.RelativeType)
            .Include(u => u.UserMedicalRecord.MedicalRecord.MedicalRecordPersonalDiseases)
            .ThenInclude(mrdp => mrdp.Disease)
            .Include(u => u.UserMedicalRecord.MedicalRecord.MedicalRecordSubstances)
            .ThenInclude(mrs => mrs.Substance)
            .Include(u => u.UserMedicalRecord.MedicalRecord.MedicalRecordSubstances)
            .ThenInclude(mrs => mrs.ConsumptionLevel)
            .Include(u => u.UserMedicalRecord.MedicalRecord.MedicalRecordFamilyDiseases)
            .ThenInclude(mrfd => mrfd.Disease)
            .Include(u =>
                u.UserMedicalRecord.MedicalRecord.MedicalRecordCompanion.Companion.CompanionRelativeType.RelativeType)
            .Include(u =>
                u.UserMedicalRecord.MedicalRecord.MedicalRecordCompanion.Companion.CompanionOccupation.Occupation)
            .Include(u => u.UserMedicalRecord.MedicalRecord.MedicalRecordEducationLevel.EducationLevel)
            .Include(u => u.UserMedicalRecord.MedicalRecord.MedicalRecordOccupation.Occupation)
            .Include(u => u.UserMedicalRecord.MedicalRecord.MedicalRecordColorBlindness.ColorBlindness)
            .Include(u => u.UserMedicalRecord.MedicalRecord.MedicalRecordMaritalStatus.MaritalStatus);
    }

    public static IQueryable<AppUser> IncludeMedicalInsuranceProperties(this IQueryable<AppUser> query)
    {
        return query
            .Include(x => x.UserMedicalInsuranceCompanies)
            .ThenInclude(x => x.MedicalInsuranceCompany)
            .ThenInclude(x => x.MedicalInsuranceCompanyPhoto.Photo)
            .AsSplitQuery();
    }

    /// <summary>
    /// Applies filtering based on NurseParams.
    /// </summary>
    public static IQueryable<AppUser> ApplyNurseFiltering(this IQueryable<AppUser> query, NurseParams param)
    {
        if (param.DoctorId.HasValue)
        {
            query = query.Where(x => x.NursesDoctor.Any(x => x.DoctorId == param.DoctorId.Value));
        }

        if (param.UserId.HasValue)
        {
            query = query.Where(x => x.Id != param.UserId.Value);
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

        return query;
    }

    /// <summary>
    /// Applies sorting based on NurseParams.
    /// </summary>
    public static IQueryable<AppUser> ApplyNurseSorting(this IQueryable<AppUser> query, NurseParams param)
    {
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

        return query;
    }

    /// <summary>
    /// Applies nurse role filtering for option selections.
    /// </summary>
    public static IQueryable<AppUser> ApplyNurseRoleFiltering(this IQueryable<AppUser> query)
    {
        return query
            .Include(x => x.DoctorNurses).ThenInclude(x => x.Nurse)
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .Include(x => x.NursesDoctor).ThenInclude(x => x.Doctor)
            .Where(x => x.UserRoles.Any(x => x.Role.Name == "Nurse"));
    }
}