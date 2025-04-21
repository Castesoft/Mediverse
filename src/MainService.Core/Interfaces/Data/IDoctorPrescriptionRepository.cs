using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IDoctorPrescriptionRepository : IRepository<DoctorPrescription>
{
    Task<List<DoctorPrescription>> FindByDoctorIdAsync(int doctorId);
}