using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Orders;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Infrastructure.QueryExtensions;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;


namespace MainService.Infrastructure.Data;

public class OrderRepository(DataContext context, IMapper mapper) : IOrderRepository
{
    public void Add(Order item) => context.Orders.Add(item);

    public void Delete(Order item) => context.Orders.Remove(item);

    public async Task<Order?> GetByIdAsync(int id) =>
        await context.Orders
            .Include(x => x.OrderDeliveryStatus).ThenInclude(x => x.DeliveryStatus)
            .Include(x => x.OrderOrderStatus).ThenInclude(x => x.OrderStatus)
            .Include(x => x.DoctorOrder).ThenInclude(x => x.Doctor)
            .Include(x => x.PatientOrder).ThenInclude(x => x.Patient)
            .Include(x => x.OrderItems).ThenInclude(x => x.Product)
            .Include(x => x.OrderDeliveryAddress).ThenInclude(x => x.DeliveryAddress)
            .Include(x => x.OrderPickupAddress).ThenInclude(x => x.PickupAddress)
            .Where(x => x.Id == id).FirstOrDefaultAsync();

    public async Task<bool> ExistsByIdAsync(int id) => await context.Orders.AnyAsync(x => x.Id == id);

    public async Task<OrderDto?> GetDtoByIdAsync(int id) =>
        await context.Orders
            .Include(x => x.OrderOrderStatus.OrderStatus)
            .Include(x => x.OrderDeliveryStatus.DeliveryStatus)
            .Include(x => x.DoctorOrder).ThenInclude(x => x.Doctor)
            .Include(x => x.OrderItems).ThenInclude(x => x.Product)
            .Include(x => x.OrderDeliveryAddress.DeliveryAddress)
            .Include(x => x.OrderPickupAddress.PickupAddress)
            .Include(x => x.PatientOrder).ThenInclude(x => x.Patient)
            .Include(x => x.OrderItems).ThenInclude(x => x.Product).ThenInclude(x => x.ProductPhotos)
            .ThenInclude(x => x.Photo)
            .AsNoTracking()
            .ProjectTo<OrderDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<Order?> GetByIdAsNoTrackingAsync(int id) =>
        await context.Orders
            .Include(x => x.OrderOrderStatus.OrderStatus)
            .Include(x => x.OrderDeliveryStatus.DeliveryStatus)
            .Include(x => x.DoctorOrder).ThenInclude(x => x.Doctor)
            .Include(x => x.OrderItems).ThenInclude(x => x.Product)
            .Include(x => x.OrderDeliveryAddress.DeliveryAddress)
            .Include(x => x.OrderPickupAddress.PickupAddress)
            .Include(x => x.PatientOrder).ThenInclude(x => x.Patient)
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<List<OrderHistoryDto>> GetHistoryByIdAsync(int orderId)
    {
        return await context.OrderHistories
            .Include(x => x.Order)
            .Include(x => x.User).ThenInclude(x => x.UserPhoto)
            .Where(x => x.OrderId == orderId)
            .OrderByDescending(x => x.CreatedAt)
            .ProjectTo<OrderHistoryDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<List<Order>> GetAllAsync() =>
        await context.Orders.ToListAsync();

    public Task<List<OrderDto>> GetAllDtoAsync(OrderParams param)
    {
        throw new NotImplementedException();
    }

    public async Task<PagedList<OrderDto>> GetPagedListAsync(OrderParams param)
    {
        var query = context.Orders.AsQueryable();
        
        // Apply the query extensions
        query = query.ApplyFullIncludes()
                     .ApplyAccessControl(param)
                     .ApplyFiltering(param)
                     .ApplySorting(param);

        return await PagedList<OrderDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<OrderDto>(mapper.ConfigurationProvider), 
            param.PageNumber, param.PageSize);
    }
}