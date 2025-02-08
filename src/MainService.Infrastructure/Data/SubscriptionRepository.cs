using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Subscriptions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data
{
    public class SubscriptionRepository(DataContext context, IMapper mapper) : ISubscriptionRepository
    {
        public void Add(Subscription subscription)
        {
            context.Subscriptions.Add(subscription);
        }

        public async Task<Subscription?> GetByIdAsync(int id)
        {
            return await context.Subscriptions
                .Include(s => s.SubscriptionPlan)
                .Include(s => s.SubscriptionHistories)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<List<Subscription>> GetSubscriptionsByUserIdAsync(int userId)
        {
            return await context.Subscriptions
                .Where(s => s.UserId == userId)
                .Include(s => s.SubscriptionPlan)
                .Include(s => s.SubscriptionHistories)
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

        public void Delete(Subscription subscription)
        {
            context.Subscriptions.Remove(subscription);
        }
    }
}