using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IDoctorReviewRepository : IRepository<DoctorReview>
{
    Task<List<DoctorReview>> FindByDoctorIdAsync(int doctorId);
}