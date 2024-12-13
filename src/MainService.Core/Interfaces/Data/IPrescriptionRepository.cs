
using System.Security.Claims;
using MainService.Core.DTOs.Prescription;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IPrescriptionRepository
{
    void Add(Prescription item);
    void Delete(Prescription item);
    Task<PrescriptionDto?> GetDtoByIdAsync(int id);
    Task<Prescription?> GetByIdAsync(int id);
    Task<PagedList<PrescriptionDto>> GetPagedListAsync(PrescriptionParams param, ClaimsPrincipal user);
    Task<Prescription?> GetByIdAsNoTrackingAsync(int id);
}