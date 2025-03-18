using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;
public interface IMedicalLicenseRepository
{
    Task<MedicalLicense?> GetByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> ExistsByNameAsync(string name);
    Task<bool> ExistsByCodeAsync(string code);
    Task<List<MedicalLicenseDto>> GetAllDtosAsync();
    Task<PagedList<MedicalLicenseDto>> GetPagedListAsync(MedicalLicenseParams param, bool getAll = false);
    Task<MedicalLicenseDto?> GetDtoByIdAsync(int id);
    Task<MedicalLicense?> GetAsNoTrackingByIdAsync(int id);
    Task<MedicalLicenseDto?> FindDtoByNameAsync(string name);
    Task<MedicalLicense?> GetByNameAsync(string name);
    Task<MedicalLicense?> GetByCodeAsync(string code);
    void Add(MedicalLicense item);
    void Delete(MedicalLicense item);
    Task<bool> ExistsByIdAndDoctorIdAsync(int id, int doctorId);
}