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
}