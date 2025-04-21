using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IUserMedicalRecordRepository : IRepository<UserMedicalRecord>
{
    Task<List<UserMedicalRecord>> FindByUserIdAsync(int userId);
}