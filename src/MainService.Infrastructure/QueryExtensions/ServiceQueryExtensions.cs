using System.Security.Claims;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.QueryExtensions;

public static class ServiceQueryExtensions
{
    /// <summary>
    /// Includes related navigation properties for Service.
    /// </summary>
    public static IQueryable<Service> ApplyIncludes(this IQueryable<Service> query)
    {
        return query
            .Include(x => x.DoctorService)
            .ThenInclude(x => x.Doctor);
    }

    /// <summary>
    /// Applies access control based on user claims.
    /// </summary>
    public static IQueryable<Service> ApplyAccessControl(this IQueryable<Service> query, ServiceParams param, ClaimsPrincipal user)
    {
        var userId = user.GetUserId();
        
        if (param.DoctorId.HasValue)
        {
            query = query.Where(x => x.DoctorService.DoctorId == param.DoctorId.Value);
        }
        else
        {
            query = query.Where(x => x.DoctorService.DoctorId == userId);
        }

        return query;
    }

    /// <summary>
    /// Applies filters based on ServiceParams.
    /// </summary>
    public static IQueryable<Service> ApplyFiltering(this IQueryable<Service> query, ServiceParams param)
    {
        if (!string.IsNullOrEmpty(param.Search))
        {
            var term = param.Search.ToLower();
            query = query.Where(x =>
                (!string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term)) ||
                (!string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term)) ||
                (x.Price != null && x.Price.ToString().ToLower().Contains(term)) ||
                (x.Discount != null && x.Discount.ToString().ToLower().Contains(term))
            );
        }

        return query;
    }

    /// <summary>
    /// Applies sorting based on ServiceParams.
    /// </summary>
    public static IQueryable<Service> ApplySorting(this IQueryable<Service> query, ServiceParams param)
    {
        if (!string.IsNullOrEmpty(param.Sort))
        {
            query = param.Sort.ToLower() switch
            {
                "id" => param.IsSortAscending.GetValueOrDefault()
                    ? query.OrderBy(x => x.Id)
                    : query.OrderByDescending(x => x.Id),
                "name" => param.IsSortAscending.GetValueOrDefault()
                    ? query.OrderBy(x => x.Name)
                    : query.OrderByDescending(x => x.Name),
                "description" => param.IsSortAscending.GetValueOrDefault()
                    ? query.OrderBy(x => x.Description)
                    : query.OrderByDescending(x => x.Description),
                "price" => param.IsSortAscending.GetValueOrDefault()
                    ? query.OrderBy(x => x.Price)
                    : query.OrderByDescending(x => x.Price),
                "discount" => param.IsSortAscending.GetValueOrDefault()
                    ? query.OrderBy(x => x.Discount)
                    : query.OrderByDescending(x => x.Discount),
                "createdat" => param.IsSortAscending.GetValueOrDefault()
                    ? query.OrderBy(x => x.CreatedAt)
                    : query.OrderByDescending(x => x.CreatedAt),
                _ => query.OrderByDescending(x => x.CreatedAt),
            };
        }
        else
        {
            query = query.OrderByDescending(x => x.CreatedAt);
        }

        return query;
    }

    /// <summary>
    /// Applies filtering for service options.
    /// </summary>
    public static IQueryable<Service> ApplyOptionsFilter(this IQueryable<Service> query, ServiceParams param)
    {
        if (param.DoctorId.HasValue)
        {
            query = query.Where(x => x.DoctorService.DoctorId == param.DoctorId.Value);
        }

        return query;
    }
}
