using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IUserReviewRepository : IRepository<UserReview>
{
    Task<List<UserReview>> FindByUserIdAsync(int userId);
}