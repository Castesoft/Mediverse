using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IDoctorOrderRepository : IRepository<DoctorOrder>
{
    Task<List<DoctorOrder>> FindByDoctorIdAsync(int doctorId);
}