using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Orders;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;


namespace MainService.Infrastructure.Data;

public class OrderRepository(DataContext context, IMapper mapper) : IOrderRepository
{
    public void Add(Order item) => context.Orders.Add(item);

    public void Delete(Order item) => context.Orders.Remove(item);

    public async Task<Order?> GetByIdAsync(int id) =>
        await context.Orders.Where(x => x.Id == id).FirstOrDefaultAsync()
    ;

    public async Task<bool> ExistsByIdAsync(int id) => await context.Orders.AnyAsync(x => x.Id == id);

    public async Task<OrderDto?> GetDtoByIdAsync(int id) =>
        await context.Orders
            .Include(x => x.OrderOrderStatus.OrderStatus)
            .Include(x => x.OrderDeliveryStatus.DeliveryStatus)
            .Include(x => x.DoctorOrder).ThenInclude(x => x.Doctor)
            .Include(x => x.OrderItems).ThenInclude(x => x.Item)
            .Include(x => x.OrderDeliveryAddress.DeliveryAddress)
            .Include(x => x.OrderPickupAddress.PickupAddress)
            .Include(x => x.PatientOrder).ThenInclude(x => x.Patient)
            .AsNoTracking()
            .ProjectTo<OrderDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<Order?> GetByIdAsNoTrackingAsync(int id) =>
        await context.Orders
            .Include(x => x.OrderOrderStatus.OrderStatus)
            .Include(x => x.OrderDeliveryStatus.DeliveryStatus)
            .Include(x => x.DoctorOrder).ThenInclude(x => x.Doctor)
            .Include(x => x.OrderItems).ThenInclude(x => x.Item)
            .Include(x => x.OrderDeliveryAddress.DeliveryAddress)
            .Include(x => x.OrderPickupAddress.PickupAddress)
            .Include(x => x.PatientOrder).ThenInclude(x => x.Patient)
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<List<Order>> GetAllAsync() =>
        await context.Orders.ToListAsync()
    ;

    public Task<List<OrderDto>> GetAllDtoAsync(OrderParams param)
    {
        throw new NotImplementedException();
    }

    public async Task<PagedList<OrderDto>> GetPagedListAsync(OrderParams param)
    {
        IQueryable<Order> query = context.Orders
            .Include(x => x.OrderOrderStatus.OrderStatus)
            .Include(x => x.OrderDeliveryStatus.DeliveryStatus)
            .Include(x => x.DoctorOrder).ThenInclude(x => x.Doctor)
            .Include(x => x.OrderItems).ThenInclude(x => x.Item)
            .Include(x => x.OrderDeliveryAddress.DeliveryAddress)
            .Include(x => x.OrderPickupAddress.PickupAddress)
            .Include(x => x.PatientOrder).ThenInclude(x => x.Patient)
            .AsQueryable()
        ;

        if (param.DoctorId.HasValue)
        {
            query = query.Where(x => x.DoctorOrder.DoctorId == param.DoctorId.Value);
        }

        if (!string.IsNullOrEmpty(param.Sort))
        {
            query = param.Sort.ToLower() switch
            {
                "id" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Id) : query.OrderByDescending(x => x.Id),
                "name" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Name) : query.OrderByDescending(x => x.Name),
                "description" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Description) : query.OrderByDescending(x => x.Description),
                "total" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Total) : query.OrderByDescending(x => x.Total),
                "subtotal" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Subtotal) : query.OrderByDescending(x => x.Subtotal),
                "discount" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Discount) : query.OrderByDescending(x => x.Discount),
                "tax" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Tax) : query.OrderByDescending(x => x.Tax),
                "amountpaid" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.AmountPaid) : query.OrderByDescending(x => x.AmountPaid),
                "amountdue" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.AmountDue) : query.OrderByDescending(x => x.AmountDue),
                "createdat" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.CreatedAt) : query.OrderByDescending(x => x.CreatedAt),
                _ => query.OrderByDescending(x => x.CreatedAt),
            };
        } else {
            query = query.OrderByDescending(x => x.CreatedAt);
        }

        if (!string.IsNullOrEmpty(param.Search))
        {
            string term = param.Search.ToLower();
            
            query = query.Where(
                x =>
                    !string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term)
            );
        }
        

        return await PagedList<OrderDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<OrderDto>(mapper.ConfigurationProvider), param.PageNumber, param.PageSize);
    }
}