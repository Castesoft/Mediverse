using System.Security.Claims;
using MainService.Core.DTOs.Patients;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;
public interface IPatientRepository
{
    Task<PatientDto?> GetDtoByIdAsync(int id);
    Task<bool> ExistsAsync(int id, int doctorId);
    Task<List<PatientDto>> GetAllDtoAsync(PatientParams param);
    Task<PagedList<PatientDto>> GetPagedListAsync(PatientParams param, ClaimsPrincipal user);
    Task<List<OptionDto>> GetOptionsAsync(PatientParams param);
}