using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;
public interface IPaymentMethodTypeRepository
{
    Task<PaymentMethodType?> GetByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> ExistsByNameAsync(string name);
    Task<bool> ExistsByCodeAsync(string code);
    Task<List<PaymentMethodTypeDto>> GetAllDtosAsync();
    Task<PagedList<PaymentMethodTypeDto>> GetPagedListAsync(PaymentMethodTypeParams param, bool getAll = false);
    Task<PaymentMethodTypeDto?> GetDtoByIdAsync(int id);
    Task<PaymentMethodType?> GetAsNoTrackingByIdAsync(int id);
    Task<PaymentMethodTypeDto?> FindDtoByNameAsync(string name);
    Task<PaymentMethodType?> GetByNameAsync(string name);
    Task<PaymentMethodType?> GetByCodeAsync(string code);
    void Add(PaymentMethodType item);
    void Delete(PaymentMethodType item);
    Task<bool> ExistsByIdAndDoctorIdAsync(int id, int doctorId);
}