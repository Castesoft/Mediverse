using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IDoctorEventRepository : IRepository<DoctorEvent>
{
    Task<List<DoctorEvent>> FindByDoctorIdAsync(int doctorId);
}