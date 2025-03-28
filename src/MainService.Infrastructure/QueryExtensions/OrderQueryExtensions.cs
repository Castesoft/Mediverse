using MainService.Core.Helpers.Params;
using MainService.Models.Entities;
using MainService.Models.Helpers.Enums;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MainService.Infrastructure.QueryExtensions;

public static class OrderQueryExtensions
{
    /// <summary>
    /// Includes related navigation properties for Order queries.
    /// </summary>
    public static IQueryable<Order> ApplyIncludes(this IQueryable<Order> query)
    {
        return query
            .Include(x => x.OrderOrderStatus).ThenInclude(x => x.OrderStatus)
            .Include(x => x.OrderDeliveryStatus).ThenInclude(x => x.DeliveryStatus)
            .Include(x => x.DoctorOrder).ThenInclude(x => x.Doctor)
            .Include(x => x.OrderItems).ThenInclude(x => x.Product)
            .Include(x => x.OrderDeliveryAddress).ThenInclude(x => x.DeliveryAddress)
            .Include(x => x.OrderPickupAddress).ThenInclude(x => x.PickupAddress)
            .Include(x => x.PatientOrder).ThenInclude(x => x.Patient)
            .AsSplitQuery();
    }

    /// <summary>
    /// Includes all related entities including product photos.
    /// </summary>
    public static IQueryable<Order> ApplyFullIncludes(this IQueryable<Order> query)
    {
        return query
            .Include(x => x.OrderOrderStatus).ThenInclude(x => x.OrderStatus)
            .Include(x => x.OrderDeliveryStatus).ThenInclude(x => x.DeliveryStatus)
            .Include(x => x.DoctorOrder).ThenInclude(x => x.Doctor)
            .Include(x => x.OrderItems).ThenInclude(x => x.Product).ThenInclude(x => x.ProductPhotos)
            .ThenInclude(x => x.Photo)
            .Include(x => x.OrderDeliveryAddress).ThenInclude(x => x.DeliveryAddress)
            .Include(x => x.OrderPickupAddress).ThenInclude(x => x.PickupAddress)
            .Include(x => x.PatientOrder).ThenInclude(x => x.Patient)
            .AsSplitQuery();
    }

    /// <summary>
    /// Applies access control based on user roles and order parameters.
    /// </summary>
    public static IQueryable<Order> ApplyAccessControl(this IQueryable<Order> query, OrderParams param)
    {
        if (!string.IsNullOrEmpty(param.FromSection))
        {
            if (param.FromSection == SiteSection.Admin)
            {
                Log.Information(Roles.Admin.ToString());
                if (!param.RequestingUserRole.Contains(Roles.Admin.ToString()))
                    throw new UnauthorizedAccessException("Access denied. Admin role required.");
            }
            else
            {
                if (!param.PatientId.HasValue && !param.DoctorId.HasValue)
                {
                    query = query.Where(x =>
                        x.PatientOrder.PatientId == param.RequestingUserId ||
                        x.DoctorOrder.DoctorId == param.RequestingUserId);
                }
                else
                {
                    if (param.PatientId.HasValue)
                        query = query.Where(x => x.PatientOrder.PatientId == param.PatientId.Value);

                    if (param.DoctorId.HasValue)
                        query = query.Where(x => x.DoctorOrder.DoctorId == param.DoctorId.Value);
                }
            }
        }
        else
        {
            if (!param.PatientId.HasValue && !param.DoctorId.HasValue)
            {
                query = query.Where(x =>
                    x.PatientOrder.PatientId == param.RequestingUserId ||
                    x.DoctorOrder.DoctorId == param.RequestingUserId);
            }
            else
            {
                if (param.PatientId.HasValue)
                    query = query.Where(x => x.PatientOrder.PatientId == param.PatientId.Value);

                if (param.DoctorId.HasValue)
                    query = query.Where(x => x.DoctorOrder.DoctorId == param.DoctorId.Value);
            }
        }

        return query;
    }

    /// <summary>
    /// Applies filtering based on search term and date range in OrderParams.
    /// </summary>
    public static IQueryable<Order> ApplyFiltering(this IQueryable<Order> query, OrderParams param)
    {
        if (!string.IsNullOrEmpty(param.Search))
        {
            var term = param.Search.ToLower();

            query = query.Where(x =>
                !string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term) ||
                !string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term) || 
                !string.IsNullOrEmpty(x.OrderOrderStatus.OrderStatus.Name) && x.OrderOrderStatus.OrderStatus.Name.ToLower().Contains(term) ||
                !string.IsNullOrEmpty(x.OrderDeliveryStatus.DeliveryStatus.Name) && x.OrderDeliveryStatus.DeliveryStatus.Name.ToLower().Contains(term) ||
                !string.IsNullOrEmpty(x.DoctorOrder.Doctor.FirstName) && x.DoctorOrder.Doctor.FirstName.ToLower().Contains(term) ||
                !string.IsNullOrEmpty(x.DoctorOrder.Doctor.LastName) && x.DoctorOrder.Doctor.LastName.ToLower().Contains(term) ||
                !string.IsNullOrEmpty(x.PatientOrder.Patient.FirstName) && x.PatientOrder.Patient.FirstName.ToLower().Contains(term) ||
                !string.IsNullOrEmpty(x.PatientOrder.Patient.LastName) && x.PatientOrder.Patient.LastName.ToLower().Contains(term) ||
                !string.IsNullOrEmpty(x.OrderItems.FirstOrDefault().Product.Name) && x.OrderItems.FirstOrDefault().Product.Name.ToLower().Contains(term) ||
                !string.IsNullOrEmpty(x.OrderItems.FirstOrDefault().Product.Description) && x.OrderItems.FirstOrDefault().Product.Description.ToLower().Contains(term) ||
                !string.IsNullOrEmpty(x.OrderItems.FirstOrDefault().Product.Manufacturer) && x.OrderItems.FirstOrDefault().Product.Manufacturer.ToLower().Contains(term) ||
                !string.IsNullOrEmpty(x.OrderItems.FirstOrDefault().Product.LotNumber) && x.OrderItems.FirstOrDefault().Product.LotNumber.ToLower().Contains(term) ||
                !string.IsNullOrEmpty(x.OrderItems.FirstOrDefault().Product.Unit) && x.OrderItems.FirstOrDefault().Product.Unit.ToLower().Contains(term) ||
                !string.IsNullOrEmpty(x.OrderDeliveryAddress.DeliveryAddress.Street) && x.OrderDeliveryAddress.DeliveryAddress.Street.ToLower().Contains(term) ||
                !string.IsNullOrEmpty(x.OrderDeliveryAddress.DeliveryAddress.City) && x.OrderDeliveryAddress.DeliveryAddress.City.ToLower().Contains(term) ||
                !string.IsNullOrEmpty(x.OrderDeliveryAddress.DeliveryAddress.State) && x.OrderDeliveryAddress.DeliveryAddress.State.ToLower().Contains(term) ||
                !string.IsNullOrEmpty(x.OrderDeliveryAddress.DeliveryAddress.Country) && x.OrderDeliveryAddress.DeliveryAddress.Country.ToLower().Contains(term) ||
                !string.IsNullOrEmpty(x.OrderDeliveryAddress.DeliveryAddress.Zipcode) && x.OrderDeliveryAddress.DeliveryAddress.Zipcode.ToLower().Contains(term) ||
                !string.IsNullOrEmpty(x.OrderDeliveryAddress.DeliveryAddress.ExteriorNumber) && x.OrderDeliveryAddress.DeliveryAddress.ExteriorNumber.ToLower().Contains(term)
            );
        }

        if (param.DateFrom.HasValue)
        {
            query = query.Where(x => x.CreatedAt >= param.DateFrom.Value);
        }

        if (param.DateTo.HasValue)
        {
            query = query.Where(x => x.CreatedAt <= param.DateTo.Value);
        }

        if (!string.IsNullOrEmpty(param.Status))
        {
            var status = param.Status.ToLower();

            switch (status)
            {
                case "paid":
                    query = query.Where(x => x.PaymentStatus == PaymentStatus.Succeeded);
                    break;
                case "unpaid":
                    query = query.Where(x => x.PaymentStatus != PaymentStatus.Succeeded);
                    break;
                default:
                    Log.Warning("Invalid status parameter: {Status}", param.Status);
                    break;
            }
        }

        return query;
    }

    /// <summary>
    /// Applies sorting based on OrderParams.
    /// </summary>
    public static IQueryable<Order> ApplySorting(this IQueryable<Order> query, OrderParams param)
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
                "total" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Total)
                    : query.OrderByDescending(x => x.Total),
                "subtotal" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Subtotal)
                    : query.OrderByDescending(x => x.Subtotal),
                "discount" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Discount)
                    : query.OrderByDescending(x => x.Discount),
                "tax" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Tax)
                    : query.OrderByDescending(x => x.Tax),
                "amountpaid" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.AmountPaid)
                    : query.OrderByDescending(x => x.AmountPaid),
                "amountdue" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.AmountDue)
                    : query.OrderByDescending(x => x.AmountDue),
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
}
