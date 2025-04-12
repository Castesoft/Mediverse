using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities.Aggregate;


namespace MainService.Infrastructure.Data;
public class PaymentMethodTypeRepository(DataContext context, IMapper mapper) : IPaymentMethodTypeRepository
{
    public async Task<PaymentMethodTypeDto?> FindDtoByNameAsync(string name) => 
        await context.PaymentMethodTypes.ProjectTo<PaymentMethodTypeDto>(mapper.ConfigurationProvider).AsNoTracking()
            .SingleOrDefaultAsync(x => x.Name == name)
        ;

    public async Task<PaymentMethodType?> GetByNameAsync(string name) =>
        await context.PaymentMethodTypes.SingleOrDefaultAsync(x => x.Name == name);

    public async Task<PaymentMethodType?> GetByCodeAsync(string code) =>
        await context.PaymentMethodTypes.SingleOrDefaultAsync(x => x.Code == code)
    ;

    public void Add(PaymentMethodType item) => context.PaymentMethodTypes.Add(item);
    public void Delete(PaymentMethodType item) => context.PaymentMethodTypes.Remove(item);

    public async Task<List<PaymentMethodTypeDto>> GetAllDtosAsync() => await context.PaymentMethodTypes
            .AsNoTracking()
            .ProjectTo<PaymentMethodTypeDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<PaymentMethodType?> GetAsNoTrackingByIdAsync(int id) =>
        await context.PaymentMethodTypes
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<List<PaymentMethodType>> GetAllAsync()
    {
        return await context.PaymentMethodTypes
            .Include(x => x.DoctorPaymentMethodTypes)
            .ThenInclude(x => x.Doctor)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<PaymentMethodType?> GetByIdAsync(int id) =>
        await context.PaymentMethodTypes
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PaymentMethodTypeDto?> GetDtoByIdAsync(int id) =>
        await context.PaymentMethodTypes
            .ProjectTo<PaymentMethodTypeDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<PaymentMethodTypeDto>> GetPagedListAsync(PaymentMethodTypeParams param, bool getAll = false)
    {
        IQueryable<PaymentMethodType> query = context.PaymentMethodTypes.AsQueryable();

        if (!string.IsNullOrEmpty(param.Sort))
        {
            query = param.Sort.ToLower() switch
            {
                "id" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Id) : query.OrderByDescending(x => x.Id),
                "code" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Code) : query.OrderByDescending(x => x.Code),
                "codenumber" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.CodeNumber) : query.OrderByDescending(x => x.CodeNumber),
                "name" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Name) : query.OrderByDescending(x => x.Name),
                "description" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Description) : query.OrderByDescending(x => x.Description),
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
                    !string.IsNullOrEmpty(x.Code) && x.Code.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term) ||
                    x.CodeNumber.HasValue && x.CodeNumber.Value.ToString().ToLower().Contains(term)
            );
        }

        return await PagedList<PaymentMethodTypeDto>.CreateAsync(
            query.ProjectTo<PaymentMethodTypeDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize);
    }

    public async Task<List<OptionDto>> GetOptionsAsync() => 
        await context.PaymentMethodTypes
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<bool> ExistsByIdAsync(int id) =>
        await context.PaymentMethodTypes.AsNoTracking().AnyAsync(x => x.Id == id);

    public Task<bool> ExistsByNameAsync(string name) => 
        context.PaymentMethodTypes.AsNoTracking().AllAsync(x => x.Name != name);

    public Task<bool> ExistsByCodeAsync(string code) =>
        context.PaymentMethodTypes.AsNoTracking().AllAsync(x => x.Code != code);

    public async Task<bool> ExistsByIdAndDoctorIdAsync(int id, int doctorId) => 
        await context.PaymentMethodTypes
            .Include(x => x.DoctorPaymentMethodTypes)
            .AnyAsync(x => x.Id == id && x.DoctorPaymentMethodTypes.Any(y => y.DoctorId == doctorId));
}