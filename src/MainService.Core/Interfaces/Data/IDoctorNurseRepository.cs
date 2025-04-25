using MainService.Core.DTOs.DoctorNurses;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IDoctorNurseRepository : IRepository<DoctorNurse>
{
    Task<DoctorNurse?> FindByCompositeKeyAsync(int doctorId, int nurseId);

    Task<PagedList<DoctorNurseDto>> GetPagedDoctorNurseConnectionsAsync(DoctorNurseParams param);

    Task<List<DoctorNurse>> FindByDoctorIdAsync(int doctorId);
    Task<List<DoctorNurse>> FindByNurseIdAsync(int nurseId);
}