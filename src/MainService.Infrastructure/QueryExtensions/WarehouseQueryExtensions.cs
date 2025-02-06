using MainService.Core.Helpers.Params;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.QueryExtensions;

public static class WarehouseQueryExtensions
{
    /// <summary>
    /// Includes related navigation properties for Warehouse.
    /// </summary>
    public static IQueryable<Warehouse> Includes(this IQueryable<Warehouse> query)
    {
        return query
            .Include(x => x.WarehouseProducts).ThenInclude(x => x.Product)
            .AsSplitQuery();
    }

    /// <summary>
    /// Applies filtering based on the search term in WarehouseParams.
    /// </summary>
    public static IQueryable<Warehouse> ApplyFilter(this IQueryable<Warehouse> query, WarehouseParams param)
    {
        if (string.IsNullOrEmpty(param.Search)) return query;

        var term = param.Search.ToLower();

        query = query.Where(x =>
            (!string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term)) ||
            (!string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term))
        );

        return query;
    }

    /// <summary>
    /// Applies sorting based on WarehouseParams.
    /// </summary>
    public static IQueryable<Warehouse> ApplySorting(this IQueryable<Warehouse> query, WarehouseParams param)
    {
        if (!string.IsNullOrEmpty(param.Sort))
        {
            query = param.Sort.ToLower() switch
            {
                "id" => (param.IsSortAscending.HasValue && param.IsSortAscending.Value)
                    ? query.OrderBy(x => x.Id)
                    : query.OrderByDescending(x => x.Id),
                "name" => (param.IsSortAscending.HasValue && param.IsSortAscending.Value)
                    ? query.OrderBy(x => x.Name)
                    : query.OrderByDescending(x => x.Name),
                "description" => (param.IsSortAscending.HasValue && param.IsSortAscending.Value)
                    ? query.OrderBy(x => x.Description)
                    : query.OrderByDescending(x => x.Description),
                _ => query.OrderByDescending(x => x.CreatedAt)
            };
        }
        else
        {
            query = query.OrderByDescending(x => x.CreatedAt);
        }

        return query;
    }
}