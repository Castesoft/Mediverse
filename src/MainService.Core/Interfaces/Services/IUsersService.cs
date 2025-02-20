using MainService.Core.DTOs.User;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;

public interface IUsersService
{
    Task<bool> DeleteAsync(AppUser item);
    Task<AccountDto?> GenerateAccountDtoAsync(int id);
    Task<bool> PhoneExistsAsync(string phoneNumber);
    Task<bool> EmailExistsAsync(string email);
    Task<List<PaymentMethodTypeDto>> GetPaymentMethodTypesAsync();
    Task<List<SpecialtyDto>> GetSpecialtiesAsync();
    Task<int> GetSpecialistsQuantityAsync();
    Task<BillingDetailsDto?> GetBillingDetailsAsync(int userId);
    Task<bool> UpdateStripeConnectAccountId(int userId, string stripeConnectAccountId);
    Task<bool> AddPatientToDoctorAsync(int doctorId, int patientIdp);

    /// <summary>
    /// Verifies if the patient has granted the doctor access to their clinical history.
    /// </summary>
    Task<ClinicalHistoryVerificationDto?> VerifyClinicalHistoryAccessAsync(int doctorId, int patientId);

    /// <summary>
    /// Updates the clinical history consent status for the given doctor and patient.
    /// </summary>
    Task<ClinicalHistoryVerificationDto?> UpdateClinicalHistoryConsentAsync(int doctorId, int patientId, bool consent);
}