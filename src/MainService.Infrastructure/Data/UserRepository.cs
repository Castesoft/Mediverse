using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs;
using MainService.Core.DTOs.User;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MainService.Infrastructure.Data;

public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
{
    public void Add(AppUser item) => context.Users.Remove(item);
    public void Delete(AppUser item) => context.Users.Remove(item);

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

    public async Task<AppUser> GetByIdAsNoTrackingAsync(int id)
    {
        var item = await context.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<AppUser> GetByIdAsync(int id)
    {
        var item = await context.Users
            .Include(x => x.Patients)
                .ThenInclude(x => x.Patient)
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<UserDto> GetDtoByIdAsync(int id)
    {
        var item = await context.Users
            .AsNoTracking()
            .Include(x => x.UserMedicalInsuranceCompanies)
                .ThenInclude(x => x.MedicalInsuranceCompany)
            .Include(x => x.PatientEvents)
                .ThenInclude(x => x.Event)
                .ThenInclude(x => x.EventPayments)
                .ThenInclude(x => x.Payment)
                .ThenInclude(x => x.PaymentPaymentMethod)
            .Include(x => x.PatientEvents)
                .ThenInclude(x => x.Event)
                .ThenInclude(x => x.EventPayments)
                .ThenInclude(x => x.Payment)
                .ThenInclude(x => x.PaymentPaymentMethodType)
            .Include(x => x.PatientEvents)
                .ThenInclude(x => x.Event)
                .ThenInclude(x => x.EventPayments)
                .ThenInclude(x => x.Payment)
                .ThenInclude(x => x.EventPayment)
                .ThenInclude(x => x.Event)
                .ThenInclude(x => x.DoctorEvent)
                .ThenInclude(x => x.Doctor)
            .Include(x => x.Doctors)
            .ProjectTo<UserDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<PatientDto> GetPatientDtoByIdAsync(int id)
    {
        var item = await context.Users
            .AsNoTracking()
            .ProjectTo<PatientDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<List<UserSummaryDto>> GetSummaryDtosAsync(UserParams param, ClaimsPrincipal user)
    {
        var query = context.Users
            .AsNoTracking()
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .Where(x => x.UserRoles.Any(x => x.Role.Name == "Patient") && x.Doctors.Any(x => x.DoctorId == user.GetUserId()))
            .AsQueryable();

        query = query.OrderBy(x => x.FirstName).ThenBy(x => x.LastName);

        if (!string.IsNullOrEmpty(param.Search))
        {
            string searchParam = param.Search.Replace(" ", "").ToLower();

            query = query.Where(x =>
                EF.Functions.Like(x.FirstName.Replace(" ", "").ToLower(), $"%{searchParam}%") ||
                EF.Functions.Like(x.LastName.Replace(" ", "").ToLower(), $"%{searchParam}%") ||
                EF.Functions.Like((x.FirstName + x.LastName).Replace(" ", "").ToLower(), $"%{searchParam}%"));
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

    public async Task<bool> PatientExistsAsync(int id, int doctorId)
    {
        return await context.Users
            .Include(x => x.Doctors)
            .AnyAsync(x => x.Id == id && x.Doctors.Any(x => x.DoctorId == doctorId));
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

    public async Task<UserDto> GetDtoByEmailAsync(string email)
    {
        var item = await context.Users
            .AsNoTracking()
            .ProjectTo<UserDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Email == email);

        return item;
    }

    public async Task<PagedList<UserDto>> GetPagedListAsync(UserParams param, ClaimsPrincipal user)
    {
        var query = context.Users
            .Include(x => x.Patients)
            .Include(x => x.Doctors)
            .Include(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .Include(x => x.DoctorNurses)
            .Include(x => x.UserAddresses)
            .ThenInclude(x => x.Address)
            .AsQueryable();

        IEnumerable<string> roles = user.GetRoles();
        int userId = user.GetUserId();

        query = query.Where(x => x.Id != userId);

        switch (param.Role)
        {
            case Roles.Admin:
                if (!roles.Contains("Admin")) return null;
                break;
            case Roles.Doctor:
                if (!roles.Contains("Admin") || !roles.Contains("Patient")) return null;
                break;
            case Roles.Patient:
                if (!roles.Contains("Doctor") && !roles.Contains("Nurse")) return null;
                if (roles.Contains("Doctor"))
                {
                    query = query.Where(x => x.UserRoles.Any(x => x.Role.Name == "Patient"));
                    query = query.Where(x => x.Doctors.Any(x => x.DoctorId == userId));
                }

                break;
            case Roles.Nurse:
                if (!roles.Contains("Doctor")) return null;
                if (roles.Contains("Doctor"))
                {
                    int doctorId = userId;

                    query = query.Where(x => x.UserRoles.Any(x => x.Role.Name == "Nurse"));
                    query = query.Where(x => x.NursesDoctor.Any(x => x.DoctorId == doctorId));
                }

                break;
            case Roles.Staff:
                if (!roles.Contains("Admin")) return null;
                break;
            default:
                break;
        }

        if (!string.IsNullOrEmpty(param.Search))
        {
            query = query.Where(x =>
                EF.Functions.Like(x.FirstName.ToLower(), $"%{param.Search}%") ||
                EF.Functions.Like(x.LastName.ToLower(), $"%{param.Search}%") ||
                EF.Functions.Like(x.Email.ToLower(), $"%{param.Search}%") ||
                EF.Functions.Like(x.Sex.ToLower(), $"%{param.Search}%") ||
                EF.Functions.Like(x.PhoneNumber.ToLower(), $"%{param.Search}%"));
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
        context.MedicalRecordFamilyMemberRelativeTypes.RemoveRange(userMedicalRecord.MedicalRecord.MedicalRecordFamilyMembers.Select(x => x.FamilyMember.MedicalRecordFamilyMemberRelativeType));
        context.MedicalRecordFamilyMembers.RemoveRange(userMedicalRecord.MedicalRecord.MedicalRecordFamilyMembers);
        context.MedicalRecordPersonalDiseases.RemoveRange(userMedicalRecord.MedicalRecord.MedicalRecordPersonalDiseases);
        context.MedicalRecordFamilyDiseases.RemoveRange(userMedicalRecord.MedicalRecord.MedicalRecordFamilyDiseases);
        context.MedicalRecordSubstances.RemoveRange(userMedicalRecord.MedicalRecord.MedicalRecordSubstances);
        if (userMedicalRecord.MedicalRecord.MedicalRecordCompanion != null) {
            context.CompanionRelativeTypes.RemoveRange(userMedicalRecord.MedicalRecord.MedicalRecordCompanion.Companion.CompanionRelativeType);
            context.MedicalRecordCompanions.Remove(userMedicalRecord.MedicalRecord.MedicalRecordCompanion);
        }
        // context.MedicalRecords.Remove(userMedicalRecord.MedicalRecord);
        context.UserMedicalRecords.Remove(userMedicalRecord);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<MedicalRecordDto> GetMedicalRecordDtoAsync(int userId)
    {
        var user = await context.Users
            .Include(u => u.UserMedicalRecord)
                .ThenInclude(umr => umr.MedicalRecord)
                    .ThenInclude(mr => mr.MedicalRecordFamilyMembers)
                        .ThenInclude(mrfm => mrfm.FamilyMember)
                            .ThenInclude(fm => fm.MedicalRecordFamilyMemberRelativeType)
                                .ThenInclude(mrfmrt => mrfmrt.RelativeType)
            .Include(u => u.UserMedicalRecord)
                .ThenInclude(umr => umr.MedicalRecord)
                    .ThenInclude(mr => mr.MedicalRecordPersonalDiseases)
                        .ThenInclude(mrdp => mrdp.Disease)
            .Include(u => u.UserMedicalRecord)
                .ThenInclude(umr => umr.MedicalRecord)
                    .ThenInclude(mr => mr.MedicalRecordSubstances)
                        .ThenInclude(mrs => mrs.Substance)
            .Include(u => u.UserMedicalRecord)
                .ThenInclude(umr => umr.MedicalRecord)
                    .ThenInclude(mr => mr.MedicalRecordSubstances)
                        .ThenInclude(mrs => mrs.ConsumptionLevel)
            .Include(u => u.UserMedicalRecord)
                .ThenInclude(umr => umr.MedicalRecord)
                    .ThenInclude(mr => mr.MedicalRecordFamilyDiseases)
                        .ThenInclude(mrfd => mrfd.Disease)
            .Include(u => u.UserMedicalRecord)
                .ThenInclude(umr => umr.MedicalRecord)
                    .ThenInclude(mr => mr.MedicalRecordCompanion)
                        .ThenInclude(mrc => mrc.Companion)
                            .ThenInclude(c => c.CompanionRelativeType)
                                .ThenInclude(c => c.RelativeType)
            .Include(u => u.UserMedicalRecord)
                .ThenInclude(umr => umr.MedicalRecord)
                    .ThenInclude(mr => mr.MedicalRecordCompanion)
                        .ThenInclude(mrc => mrc.Companion)
                            .ThenInclude(c => c.CompanionOccupation)
                                .ThenInclude(c => c.Occupation)
            .Include(u => u.UserMedicalRecord)
                .ThenInclude(umr => umr.MedicalRecord)
                    .ThenInclude(mr => mr.MedicalRecordEducationLevel)
                        .ThenInclude(mrel => mrel.EducationLevel)
            .Include(u => u.UserMedicalRecord)
                .ThenInclude(umr => umr.MedicalRecord)
                    .ThenInclude(mr => mr.MedicalRecordOccupation)
                        .ThenInclude(mro => mro.Occupation)
            .Include(u => u.UserMedicalRecord)
                .ThenInclude(umr => umr.MedicalRecord)
                    .ThenInclude(mr => mr.MedicalRecordColorBlindness)
                        .ThenInclude(mrcb => mrcb.ColorBlindness)
            .Include(u => u.UserMedicalRecord)
                .ThenInclude(umr => umr.MedicalRecord)
                    .ThenInclude(mr => mr.MedicalRecordMaritalStatus)
                        .ThenInclude(mrhs => mrhs.MaritalStatus)
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
}