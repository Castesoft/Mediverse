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

    public void Delete(Order item)
    {
        throw new NotImplementedException();
    }

    public async Task<Order> GetByIdAsync(int id)
    {
        return await context.Orders.Where(x => x.Id == id).FirstOrDefaultAsync();
    }

    public Task<Order> GetByNameAsync(string name, ClaimsPrincipal user)
    {
        throw new NotImplementedException();
    }

    public Task<bool> ExistsAsync(int id, ClaimsPrincipal user)
    {
        throw new NotImplementedException();
    }

    public Task<OrderDto> GetDtoByIdAsync(int id)
    {
        return context.Orders
            .Include(x => x.DoctorOrder).ThenInclude(x => x.Doctor)
            .Include(x => x.OrderItems).ThenInclude(x => x.Item)
            .Include(x => x.OrderAddress).ThenInclude(x => x.Address)
            .Include(x => x.PatientOrder).ThenInclude(x => x.Patient)
            .AsNoTracking()
            .ProjectTo<OrderDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);
    }

    public Task<Order> GetByIdAsNoTrackingAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<List<Order>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<List<OrderDto>> GetAllDtoAsync(OrderParams param, ClaimsPrincipal user)
    {
        throw new NotImplementedException();
    }

    public async Task<PagedList<OrderDto>> GetPagedListAsync(OrderParams param, ClaimsPrincipal user)
    {
        var query = context.Orders
            .Include(x => x.DoctorOrder).ThenInclude(x => x.Doctor)
            .Include(x => x.OrderItems).ThenInclude(x => x.Item)
            .Include(x => x.OrderAddress).ThenInclude(x => x.Address)
            .Include(x => x.PatientOrder).ThenInclude(x => x.Patient)
            .AsQueryable();

        var userId = user.GetUserId();
        var userRoles = user.GetRoles();

        foreach (var role in userRoles)
        {
            if (role == "Doctor")
            {
                query = query.Where(x => x.DoctorOrder.DoctorId == userId);
            }
        }

        if (param.DateFrom != DateTime.MinValue)
            query = query.Where(x => x.CreatedAt >= param.DateFrom);

        if (param.DateTo != DateTime.MaxValue)
            query = query.Where(x => x.CreatedAt <= param.DateTo);

        if (!string.IsNullOrEmpty(param.Sort))
        {
            switch (param.Sort)
            {
                case "id":
                    query = param.IsSortAscending
                        ? query.OrderBy(x => x.Id)
                        : query.OrderByDescending(x => x.Id);
                    break;
                case "discount":
                    query = param.IsSortAscending
                        ? query.OrderBy(x => x.Discount)
                        : query.OrderByDescending(x => x.Discount);
                    break;
                default:
                    query = query.OrderByDescending(x => x.CreatedAt);
                    break;
            }
        }

        return await PagedList<OrderDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<OrderDto>(mapper.ConfigurationProvider), param.PageNumber, param.PageSize);
    }
}