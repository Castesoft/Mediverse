using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IPatientPrescriptionRepository : IRepository<PatientPrescription>
{
    Task<List<PatientPrescription>> FindByPatientIdAsync(int patientId);
}