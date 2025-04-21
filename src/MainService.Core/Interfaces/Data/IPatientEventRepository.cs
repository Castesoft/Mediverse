using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IPatientEventRepository : IRepository<PatientEvent>
{
    Task<List<PatientEvent>> FindByPatientIdAsync(int patientId);
}