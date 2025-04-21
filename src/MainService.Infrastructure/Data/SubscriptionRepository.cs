using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Subscriptions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Infrastructure.QueryExtensions;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data
{
    public class SubscriptionRepository(DataContext context, IMapper mapper) : ISubscriptionRepository
    {
        public void Add(UserSubscription userSubscription)
        {
            context.Subscriptions.Add(userSubscription);
        }

        public async Task<UserSubscription?> GetByIdAsync(int id)
        {
            return await context.Subscriptions
                .Includes()
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public Task<SubscriptionDto?> GetDtoByIdAsync(int id)
        {
            return context.Subscriptions
                .Includes()
                .AsNoTracking()
                .ProjectTo<SubscriptionDto>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(s => s.Id == id);
        }
        
        public async Task<List<UserSubscription>> FindByUserIdAsync(int userId)
        {
            return await context.Subscriptions
                .Includes()
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .ToListAsync();
        }

        public void RemoveRange(List<UserSubscription> userSubscriptions)
        {
            context.Subscriptions.RemoveRange(userSubscriptions);
        }

        public async Task<UserSubscription?> GetByStripeSubscriptionIdAsync(string stripeSubscriptionId)
        {
            return await context.Subscriptions
                .Includes()
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.StripeSubscriptionId == stripeSubscriptionId);
        }

        public async Task<UserSubscription?> GetActiveSubscriptionForUserAsync(int userId)
        {
            return await context.Subscriptions
                .Includes()
                .AsNoTracking()
                .FirstOrDefaultAsync(s =>
                    s.UserId == userId &&
                    (s.Status == SubscriptionStatus.Active || s.Status == SubscriptionStatus.Pending));
        }

        public async Task<List<UserSubscription>> GetSubscriptionsByUserIdAsync(int userId)
        {
            return await context.Subscriptions
                .Where(s => s.UserId == userId)
                .Includes()
                .ToListAsync();
        }

        public async Task<PagedList<SubscriptionDto>> GetPagedListAsync(SubscriptionParams param)
        {
            var query = context.Subscriptions
                .Include(x => x.SubscriptionHistories)
                .Include(x => x.SubscriptionPlan)
                .AsQueryable();

            if (param.DoctorId.HasValue)
            {
                query = query.Where(x => x.UserId == param.DoctorId);
            }

            if (!string.IsNullOrEmpty(param.Search))
            {
                var term = param.Search.ToLower();

                query = query.Where(
                    x =>
                        !string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term) ||
                        !string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term)
                );
            }

            if (!string.IsNullOrEmpty(param.Sort))
            {
                query = param.Sort.ToLower() switch
                {
                    "id" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                        ? query.OrderBy(x => x.Id)
                        : query.OrderByDescending(x => x.Id),
                    "name" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                        ? query.OrderBy(x => x.Name)
                        : query.OrderByDescending(x => x.Name),
                    "description" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                        ? query.OrderBy(x => x.Description)
                        : query.OrderByDescending(x => x.Description),
                };
            }
            else
            {
                query = query.OrderByDescending(x => x.CreatedAt);
            }

            return await PagedList<SubscriptionDto>.CreateAsync(
                query.ProjectTo<SubscriptionDto>(mapper.ConfigurationProvider),
                param.PageNumber,
                param.PageSize
            );
        }

        public void Delete(UserSubscription userSubscription)
        {
            context.Subscriptions.Remove(userSubscription);
        }
    }
}