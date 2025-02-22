using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.QueryExtensions;

public static class UserQueryExtensions
{
    public static IQueryable<AppUser> IncludeMedicalRecordProperties(this IQueryable<AppUser> query)
    {
        return query
            .AsSplitQuery()
            .Include(x => x.UserMedicalRecord)
            .ThenInclude(userMedicalRecord => userMedicalRecord.MedicalRecord)
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
            .Include(x => x.UserMedicalInsuranceCompanies).ThenInclude(x => x.MedicalInsuranceCompany)
            .ThenInclude(x => x.MedicalInsuranceCompanyPhoto).ThenInclude(x => x.Photo)
            .AsSplitQuery();
    }
}