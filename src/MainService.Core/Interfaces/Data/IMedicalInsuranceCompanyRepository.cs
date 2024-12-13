using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;
public interface IMedicalInsuranceCompanyRepository
{
    Task<MedicalInsuranceCompany?> GetByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> ExistsByNameAsync(string name);
    Task<bool> ExistsByCodeAsync(string code);
    Task<List<MedicalInsuranceCompanyDto>> GetAllDtosAsync();
    Task<PagedList<MedicalInsuranceCompanyDto>> GetPagedListAsync(MedicalInsuranceCompanyParams param, bool getAll = false);
    Task<MedicalInsuranceCompanyDto?> GetDtoByIdAsync(int id);
    Task<MedicalInsuranceCompany?> GetAsNoTrackingByIdAsync(int id);
    Task<MedicalInsuranceCompanyDto?> FindDtoByNameAsync(string name);
    Task<MedicalInsuranceCompany?> GetByNameAsync(string name);
    Task<MedicalInsuranceCompany?> GetByCodeAsync(string code);
    void Add(MedicalInsuranceCompany item);
    void Delete(MedicalInsuranceCompany item);
    Task<bool> ExistsByIdAndDoctorIdAsync(int id, int doctorId);
}