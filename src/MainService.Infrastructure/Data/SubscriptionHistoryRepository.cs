using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Subscriptions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class SubscriptionHistoryRepository(DataContext context, IMapper mapper) : ISubscriptionHistoryRepository
{
    public void Add(SubscriptionHistory history)
    {
        context.SubscriptionHistories.Add(history);
    }

    public async Task<List<SubscriptionHistory>> GetHistoryBySubscriptionIdAsync(int subscriptionId)
    {
        return await context.SubscriptionHistories
            .Where(h => h.SubscriptionId == subscriptionId)
            .OrderByDescending(h => h.ChangedAt)
            .ToListAsync();
    }

    public async Task<PagedList<SubscriptionHistoryDto>> GetPagedListAsync(SubscriptionHistoryParams param)
    {
        var query = context.SubscriptionHistories
            .Include(x => x.Subscription).ThenInclude(x => x.User)
            .AsQueryable();

        if (param.DoctorId.HasValue)
        {
            query = query.Where(x => x.Subscription.UserId == param.DoctorId);
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
                _ => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Id)
                    : query.OrderByDescending(x => x.Id)
            };
        }
        else
        {
            query = query.OrderByDescending(x => x.CreatedAt);
        }

        return await PagedList<SubscriptionHistoryDto>.CreateAsync(
            query.ProjectTo<SubscriptionHistoryDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize
        );
    }
}