using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.QueryExtensions;

public static class MedicalRecordIncludes
{
    public static IQueryable<AppUser> AddMedicalRecordIncludes(this IQueryable<AppUser> query)
    {
        return query
            .Include(u => u.UserMedicalRecord)
            .ThenInclude(umr => umr.MedicalRecord)
            .ThenInclude(mr => mr.MedicalRecordFamilyMembers)
            .ThenInclude(mrfm => mrfm.FamilyMember)
            .ThenInclude(fm => fm.MedicalRecordFamilyMemberRelativeType)
            .Include(u => u.UserMedicalRecord)
            .ThenInclude(umr => umr.MedicalRecord)
            .ThenInclude(mr => mr.MedicalRecordPersonalDiseases)
            .Include(u => u.UserMedicalRecord)
            .ThenInclude(umr => umr.MedicalRecord)
            .ThenInclude(mr => mr.MedicalRecordSubstances)
            .Include(u => u.UserMedicalRecord)
            .ThenInclude(umr => umr.MedicalRecord)
            .ThenInclude(mr => mr.MedicalRecordFamilyDiseases)
            .Include(u => u.UserMedicalRecord)
            .ThenInclude(umr => umr.MedicalRecord)
            .ThenInclude(mr => mr.MedicalRecordCompanion)
            .ThenInclude(mrc => mrc.Companion)
            .ThenInclude(c => c.CompanionRelativeType)
            .ThenInclude(crt => crt.RelativeType)
            .Include(u => u.UserMedicalRecord)
            .ThenInclude(umr => umr.MedicalRecord)
            .ThenInclude(mr => mr.MedicalRecordOccupation)
            .ThenInclude(mro => mro.Occupation);
    }
}