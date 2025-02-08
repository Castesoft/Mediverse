using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class SubscriptionPlanRepository(DataContext context) : ISubscriptionPlanRepository
{
    public void Add(SubscriptionPlan plan)
    {
        context.SubscriptionPlans.Add(plan);
    }

    public async Task<SubscriptionPlan?> GetByIdAsync(int id)
    {
        return await context.SubscriptionPlans
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<SubscriptionPlan>> GetAllAsync()
    {
        return await context.SubscriptionPlans.AsNoTracking().ToListAsync();
    }

    public void Update(SubscriptionPlan plan)
    {
        context.SubscriptionPlans.Update(plan);
    }

    public void Delete(SubscriptionPlan plan)
    {
        context.SubscriptionPlans.Remove(plan);
    }
}