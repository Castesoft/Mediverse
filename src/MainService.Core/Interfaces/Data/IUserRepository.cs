using System.Security.Claims;
using MainService.Core.DTOs;
using MainService.Core.DTOs.User;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;
public interface IUserRepository
{
    void Add(AppUser item);
    void Delete(AppUser item);
    Task<AppUser> GetByIdAsync(int id);
    Task<UserDto> GetDtoByIdAsync(int id);
    Task<PatientDto> GetPatientDtoByIdAsync(int id);
    Task<List<UserSummaryDto>> GetSummaryDtosAsync(UserParams param, ClaimsPrincipal user);
    Task<bool> DoctorExistsAsync(int id, int doctorId);
    Task<bool> PatientExistsAsync(int id, int doctorId);
    Task<bool> NurseExistsAsync(int id, int doctorId);
    Task<UserDto> GetDtoByEmailAsync(string email);
    Task<AppUser> GetByIdAsNoTrackingAsync(int id);
    Task<List<AppUser>> GetAllAsync();
    Task<List<UserDto>> GetAllDtoAsync(UserParams param);
    Task<PagedList<UserDto>> GetPagedListAsync(UserParams param, ClaimsPrincipal user);
    Task<List<PaymentMethodTypeDto>> GetPaymentMethodTypesAsync();
    Task<List<SpecialtyDto>> GetSpecialtiesAsync();
    Task<List<MedicalInsuranceCompanyDto>> GetMedicalInsuranceCompaniesAsync();
    Task<bool> DeleteDoctorWorkScheduleAsync(WorkSchedule workSchedule);
    Task<bool> DeleteDoctorWorkScheduleSettingsAsync(WorkScheduleSettings workScheduleSettings);
    Task<bool> AddReviewAsync(Review review);
}