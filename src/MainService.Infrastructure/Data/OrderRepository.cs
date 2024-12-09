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
        IQueryable<Order> query = context.Orders
            .Include(x => x.DoctorOrder).ThenInclude(x => x.Doctor)
            .Include(x => x.OrderItems).ThenInclude(x => x.Item)
            .Include(x => x.OrderAddress).ThenInclude(x => x.Address)
            .Include(x => x.PatientOrder).ThenInclude(x => x.Patient)
            .AsQueryable()
        ;

        var userId = user.GetUserId();
        var userRoles = user.GetRoles();

        foreach (var role in userRoles)
        {
            if (role == "Doctor")
            {
                query = query.Where(x => x.DoctorOrder.DoctorId == userId);
            }
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