using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IDoctorNurseRepository : IRepository<DoctorNurse>
{
    Task<List<DoctorNurse>> FindByDoctorIdAsync(int doctorId);
    Task<DoctorNurse?> FindByCompositeKeyAsync(int doctorId, int nurseId);
}