using MainService.Core.DTOs.User;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;
public interface IUsersService
{
    Task<bool> DeleteAsync(AppUser item);
    Task<AccountDto> GenerateAccountDtoAsync(int id);
    Task<bool> PhoneExistsAsync(string phoneNumber);
    Task<bool> EmailExistsAsync(string email);
    Task<List<PaymentMethodTypeDto>> GetPaymentMethodTypesAsync();
    Task<List<SpecialtyDto>> GetSpecialtiesAsync();
    Task<int> GetSpecialistsQuantityAsync();
    Task<BillingDetailsDto> GetBillingDetailsAsync(int userId);
}