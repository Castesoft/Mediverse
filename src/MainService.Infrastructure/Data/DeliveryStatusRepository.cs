using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.DeliveryStatuses;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data
{
    public class DeliveryStatusRepository(DataContext context, IMapper mapper) : IDeliveryStatusRepository
    {
        public async Task<DeliveryStatusDto?> FindDtoByNameAsync(string name) =>
            await context.DeliveryStatuses.ProjectTo<DeliveryStatusDto>(mapper.ConfigurationProvider).AsNoTracking()
                .SingleOrDefaultAsync(x => x.Name == name);

        public async Task<DeliveryStatus?> GetByNameAsync(string name) =>
            await context.DeliveryStatuses.SingleOrDefaultAsync(x => x.Name == name);

        public async Task<DeliveryStatus?> GetByCodeAsync(string code) =>
            await context.DeliveryStatuses.SingleOrDefaultAsync(x => EF.Functions.Like(x.Code, code));

        public void Add(DeliveryStatus item) => context.DeliveryStatuses.Add(item);
        public void Delete(DeliveryStatus item) => context.DeliveryStatuses.Remove(item);

        public async Task<List<DeliveryStatusDto>> GetAllDtosAsync() => await context.DeliveryStatuses
                .AsNoTracking()
                .ProjectTo<DeliveryStatusDto>(mapper.ConfigurationProvider)
                .ToListAsync();

        public async Task<DeliveryStatus?> GetAsNoTrackingByIdAsync(int id) =>
            await context.DeliveryStatuses
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == id);

        public async Task<DeliveryStatus?> GetByIdAsync(int id) =>
            await context.DeliveryStatuses
                .SingleOrDefaultAsync(x => x.Id == id);

        public async Task<DeliveryStatusDto?> GetDtoByIdAsync(int id) =>
            await context.DeliveryStatuses
                .ProjectTo<DeliveryStatusDto>(mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(x => x.Id == id);

        public async Task<PagedList<DeliveryStatusDto>> GetPagedListAsync(DeliveryStatusParams param, bool getAll = false)
        {
            IQueryable<DeliveryStatus> query = context.DeliveryStatuses.AsQueryable();

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

            return await PagedList<DeliveryStatusDto>.CreateAsync(
                query.ProjectTo<DeliveryStatusDto>(mapper.ConfigurationProvider),
                param.PageNumber,
                param.PageSize);
        }

        public async Task<List<OptionDto>> GetOptionsAsync() =>
            await context.DeliveryStatuses
                .AsNoTracking()
                .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
                .ToListAsync();

        public async Task<bool> ExistsByIdAsync(int id) =>
            await context.DeliveryStatuses.AsNoTracking().AnyAsync(x => x.Id == id);

        public Task<bool> ExistsByNameAsync(string name) =>
            context.DeliveryStatuses.AsNoTracking().AllAsync(x => x.Name != name);

        public Task<bool> ExistsByCodeAsync(string code) =>
            context.DeliveryStatuses.AsNoTracking().AllAsync(x => x.Code != code);

    }
}