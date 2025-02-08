using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface ISubscriptionPlanRepository
{
    void Add(SubscriptionPlan plan);
    Task<SubscriptionPlan?> GetByIdAsync(int id);
    Task<List<SubscriptionPlan>> GetAllAsync();
    void Update(SubscriptionPlan plan);
    void Delete(SubscriptionPlan plan);
}