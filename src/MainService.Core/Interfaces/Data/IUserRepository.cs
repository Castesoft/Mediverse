using System.Security.Claims;
using MainService.Core.DTOs.MedicalRecord;
using MainService.Core.DTOs.User;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;

public interface IUserRepository
{
    void Add(AppUser item);
    void Delete(AppUser item);
    void Update(AppUser item);
    Task<AppUser?> GetByIdAsync(int id);
    Task<UserDto?> GetDtoByIdAsync(int id);
    Task<List<UserSummaryDto>> GetSummaryDtosAsync(UserParams param, ClaimsPrincipal user);
    Task<bool> DoctorExistsAsync(int id, int doctorId);
    Task<bool> NurseExistsAsync(int id, int doctorId);
    Task<UserDto?> GetDtoByEmailAsync(string email);
    Task<AppUser?> GetByIdAsNoTrackingAsync(int id);
    Task<List<AppUser>> GetAllAsync();
    Task<List<UserDto>> GetAllDtoAsync(UserParams param);
    Task<PagedList<UserDto>> GetPagedListAsync(UserParams param, ClaimsPrincipal user);
    Task<List<PaymentMethodTypeDto>> GetPaymentMethodTypesAsync();
    Task<List<SpecialtyDto>> GetSpecialtiesAsync();
    Task<List<MedicalInsuranceCompanyDto>> GetMedicalInsuranceCompaniesAsync();
    Task<bool> DeleteDoctorWorkScheduleAsync(WorkSchedule workSchedule);
    Task<bool> DeleteDoctorWorkScheduleSettingsAsync(WorkScheduleSettings workScheduleSettings);
    Task<bool> AddReviewAsync(Review review);
    Task<bool> DeleteMedicalRecordAsync(UserMedicalRecord userMedicalRecord);
    Task<MedicalRecordDto?> GetMedicalRecordDtoAsync(int userId);
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> HasDoctorRoleByIdAsync(int id);
    Task<bool> RequireAnticipatedCardPaymentsByIdAsync(int id);
    Task<int?> GetMainAddressIdAsync(int userId);
    Task<List<OptionDto>> GetPatientOptionsForDoctorAsync(UserParams param);

    /// <summary>
    /// Returns the clinical history verification information for a given patient-doctor pair.
    /// </summary>
    Task<ClinicalHistoryVerificationDto?> GetClinicalHistoryVerificationAsync(int doctorId, int patientId);
}