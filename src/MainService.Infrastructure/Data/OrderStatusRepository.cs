using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.OrderStatuses;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data
{
    public class OrderStatusRepository(DataContext context, IMapper mapper) : IOrderStatusRepository
    {
        public async Task<OrderStatusDto?> FindDtoByNameAsync(string name) =>
            await context.OrderStatuses.ProjectTo<OrderStatusDto>(mapper.ConfigurationProvider).AsNoTracking()
                .SingleOrDefaultAsync(x => x.Name == name);

        public async Task<OrderStatus?> GetByNameAsync(string name) =>
            await context.OrderStatuses.SingleOrDefaultAsync(x => x.Name == name);

        public async Task<OrderStatus?> GetByCodeAsync(string code) =>
            await context.OrderStatuses.SingleOrDefaultAsync(x => EF.Functions.Like(x.Code, code));

        public void Add(OrderStatus item) => context.OrderStatuses.Add(item);
        public void Delete(OrderStatus item) => context.OrderStatuses.Remove(item);

        public async Task<List<OrderStatusDto>> GetAllDtosAsync() => await context.OrderStatuses
                .AsNoTracking()
                .ProjectTo<OrderStatusDto>(mapper.ConfigurationProvider)
                .ToListAsync();

        public async Task<OrderStatus?> GetAsNoTrackingByIdAsync(int id) =>
            await context.OrderStatuses
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == id);

        public async Task<OrderStatus?> GetByIdAsync(int id) =>
            await context.OrderStatuses
                .SingleOrDefaultAsync(x => x.Id == id);

        public async Task<OrderStatusDto?> GetDtoByIdAsync(int id) =>
            await context.OrderStatuses
                .ProjectTo<OrderStatusDto>(mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(x => x.Id == id);

        public async Task<PagedList<OrderStatusDto>> GetPagedListAsync(OrderStatusParams param, bool getAll = false)
        {
            IQueryable<OrderStatus> query = context.OrderStatuses.AsQueryable();

            if (param.Sort != null && !string.IsNullOrEmpty(param.Sort))
            {
                query = param.Sort.ToLower() switch
                {
                    "id" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                                            ? query.OrderBy(x => x.Id)
                                            : query.OrderByDescending(x => x.Id),
                    "name" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                                            ? query.OrderBy(x => x.Name)
                                            : query.OrderByDescending(x => x.Name),
                    "lastname" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                                            ? query.OrderBy(x => x.LastName)
                                            : query.OrderByDescending(x => x.LastName),
                    "code" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                                            ? query.OrderBy(x => x.Code)
                                            : query.OrderByDescending(x => x.Code),
                    "codenumber" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                                            ? query.OrderBy(x => x.CodeNumber)
                                            : query.OrderByDescending(x => x.CodeNumber),
                    "color" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                                            ? query.OrderBy(x => x.Color)
                                            : query.OrderByDescending(x => x.Color),
                    "description" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                                            ? query.OrderBy(x => x.Description)
                                            : query.OrderByDescending(x => x.Description),
                    _ => query.OrderBy(x => x.Id),
                };
            }

            if (!string.IsNullOrEmpty(param.Search))
            {
                string term = param.Search.ToLower();

                query = query.Where(
                    x =>
                        !string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term) ||
                        !string.IsNullOrEmpty(x.Code) && x.Code.ToLower().Contains(term) ||
                        x.CodeNumber.HasValue && x.CodeNumber.Value.ToString().ToLower().Contains(term) ||
                        !string.IsNullOrEmpty(x.Color) && x.Color.ToLower().Contains(term) ||
                        !string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term) ||
                        !string.IsNullOrEmpty(x.LastName) && x.LastName.ToLower().Contains(term)
                );
            }

            return await PagedList<OrderStatusDto>.CreateAsync(
                query.ProjectTo<OrderStatusDto>(mapper.ConfigurationProvider),
                param.PageNumber,
                param.PageSize);
        }

        public async Task<List<OptionDto>> GetOptionsAsync() =>
            await context.OrderStatuses
                .AsNoTracking()
                .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
                .ToListAsync();

        public async Task<bool> ExistsByIdAsync(int id) =>
            await context.OrderStatuses.AsNoTracking().AnyAsync(x => x.Id == id);

        public Task<bool> ExistsByNameAsync(string name) =>
            context.OrderStatuses.AsNoTracking().AllAsync(x => x.Name != name);

        public Task<bool> ExistsByCodeAsync(string code) =>
            context.OrderStatuses.AsNoTracking().AllAsync(x => x.Code != code);

    }
}