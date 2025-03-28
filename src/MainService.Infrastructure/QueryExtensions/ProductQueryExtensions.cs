using System.Security.Claims;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;
using MainService.Models.Helpers.Enums;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.QueryExtensions;

public static class ProductQueryExtensions
{
    /// <summary>
    /// Includes related navigation properties for Product.
    /// </summary>
    public static IQueryable<Product> Includes(this IQueryable<Product> query)
    {
        return query
            .AsSplitQuery()
            .Include(x => x.DoctorProduct)
            .Include(x => x.ProductPhotos).ThenInclude(x => x.Photo)
            .Include(x => x.WarehouseProducts);
    }

    /// <summary>
    /// Applies section-based filtering based on ProductParams and user claims.
    /// </summary>
    public static IQueryable<Product> ApplySectionFilter(this IQueryable<Product> query, ProductParams param, ClaimsPrincipal user)
    {
        var userId = user.GetUserId();
        var userRoles = user.GetRoles();

        if (!string.IsNullOrEmpty(param.FromSection))
        {
            switch (param.FromSection)
            {
                case SiteSection.Admin when !userRoles.Contains(Roles.Admin.ToString()):
                    throw new UnauthorizedAccessException("Access denied. Admin role required.");
                case SiteSection.Admin:
                    query = query.Where(x => x.DoctorProduct == null);
                    break;
                case SiteSection.Home:
                    query = query.Where(x => x.DoctorProduct.DoctorId == userId);
                    break;
                default:
                {
                    query = query.Where(x => x.IsVisible);
                    if (param.DoctorId.HasValue)
                        query = query.Where(x => x.DoctorProduct.DoctorId == userId || x.DoctorProduct == null);
                    break;
                }
            }
        }
        else
        {
            query = query.Where(x => x.IsVisible);
            if (param.DoctorId.HasValue)
                query = query.Where(x => x.DoctorProduct.DoctorId == userId || x.DoctorProduct == null);
        }

        return query;
    }

    /// <summary>
    /// Applies filters based on ProductParams.
    /// </summary>
    public static IQueryable<Product> ApplyFilters(this IQueryable<Product> query, ProductParams param)
    {
        if (param.IsInternal.HasValue)
        {
            query = param.IsInternal.Value
                ? query.Where(x => x.DoctorProduct == null)
                : query.Where(x => x.DoctorProduct != null);
        }

        if (!string.IsNullOrEmpty(param.Barcode))
        {
            var barcodeTerm = param.Barcode.ToLower();
            query = query.Where(x => x.Barcode != null && x.Barcode.ToLower().Contains(barcodeTerm));
        }

        if (!string.IsNullOrEmpty(param.Sku))
        {
            var skuTerm = param.Sku.ToLower();
            query = query.Where(x => x.SKU != null && x.SKU.ToLower().Contains(skuTerm));
        }

        if (param.Price.HasValue)
        {
            query = query.Where(x => x.Price == param.Price);
        }

        if (!string.IsNullOrEmpty(param.LotNumber))
        {
            var lotNumberTerm = param.LotNumber.ToLower();
            query = query.Where(x => x.LotNumber != null && x.LotNumber.ToLower().Contains(lotNumberTerm));
        }

        if (!string.IsNullOrEmpty(param.Search))
        {
            var term = param.Search.ToLower();
            query = query.Where(x =>
                (!string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term)) ||
                (!string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term)) ||
                (!string.IsNullOrEmpty(x.Unit) && x.Unit.ToLower().Contains(term)) ||
                (!string.IsNullOrEmpty(x.Manufacturer) && x.Manufacturer.ToLower().Contains(term)) ||
                (!string.IsNullOrEmpty(x.LotNumber) && x.LotNumber.ToLower().Contains(term)) ||
                (x.Price.HasValue && x.Price.Value.ToString().ToLower().Contains(term)) ||
                (x.Discount.HasValue && x.Discount.Value.ToString().ToLower().Contains(term)) ||
                (x.Dosage.HasValue && x.Dosage.Value.ToString().ToLower().Contains(term)) ||
                (!string.IsNullOrEmpty(x.SKU) && x.SKU.ToLower().Contains(term)) ||
                (x.Barcode != null && x.Barcode.ToLower().Contains(term))
            );
        }

        return query;
    }

    /// <summary>
    /// Applies sorting based on ProductParams.
    /// </summary>
    public static IQueryable<Product> ApplySorting(this IQueryable<Product> query, ProductParams param)
    {
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
                "unit" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Unit)
                    : query.OrderByDescending(x => x.Unit),
                "manufacturer" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Manufacturer)
                    : query.OrderByDescending(x => x.Manufacturer),
                "lotnumber" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.LotNumber)
                    : query.OrderByDescending(x => x.LotNumber),
                "price" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Price)
                    : query.OrderByDescending(x => x.Price),
                "discount" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Discount)
                    : query.OrderByDescending(x => x.Discount),
                "dosage" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Dosage)
                    : query.OrderByDescending(x => x.Dosage),
                "createdat" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
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
    /// Filter query for typeahead/options.
    /// </summary>
    public static IQueryable<Product> ApplyOptionsFilter(this IQueryable<Product> query, ProductParams param)
    {
        return query.Where(x => x.DoctorProduct.DoctorId == param.DoctorId || x.DoctorProduct == null);
    }
}
