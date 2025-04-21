using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IPatientOrderRepository : IRepository<PatientOrder>
{
    Task<List<PatientOrder>> FindByPatientIdAsync(int patientId);
}