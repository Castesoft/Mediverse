using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities.Aggregate;


namespace MainService.Infrastructure.Data;
public class MedicalInsuranceCompanyRepository(DataContext context, IMapper mapper) : IMedicalInsuranceCompanyRepository
{
    public async Task<MedicalInsuranceCompanyDto> FindDtoByNameAsync(string name) => 
        await context.MedicalInsuranceCompanies.ProjectTo<MedicalInsuranceCompanyDto>(mapper.ConfigurationProvider).AsNoTracking()
            .SingleOrDefaultAsync(x => x.Name == name);

    public async Task<MedicalInsuranceCompany> GetByNameAsync(string name) =>
        await context.MedicalInsuranceCompanies.SingleOrDefaultAsync(x => x.Name == name);

    public async Task<MedicalInsuranceCompany> GetByCodeAsync(string code) =>
        await context.MedicalInsuranceCompanies.SingleOrDefaultAsync(x => x.Code == code);

    public void Add(MedicalInsuranceCompany item) => context.MedicalInsuranceCompanies.Add(item);
    public void Delete(MedicalInsuranceCompany item) => context.MedicalInsuranceCompanies.Remove(item);

    public async Task<List<MedicalInsuranceCompanyDto>> GetAllDtosAsync() => await context.MedicalInsuranceCompanies
            .AsNoTracking()
            .ProjectTo<MedicalInsuranceCompanyDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<MedicalInsuranceCompany> GetAsNoTrackingByIdAsync(int id) =>
        await context.MedicalInsuranceCompanies
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<MedicalInsuranceCompany> GetByIdAsync(int id) =>
        await context.MedicalInsuranceCompanies
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<MedicalInsuranceCompanyDto> GetDtoByIdAsync(int id) =>
        await context.MedicalInsuranceCompanies
            .ProjectTo<MedicalInsuranceCompanyDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<MedicalInsuranceCompanyDto>> GetPagedListAsync(MedicalInsuranceCompanyParams param, bool getAll = false)
    {
        IQueryable<MedicalInsuranceCompany> query = context.MedicalInsuranceCompanies.AsQueryable();

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

        return await PagedList<MedicalInsuranceCompanyDto>.CreateAsync(
            query.ProjectTo<MedicalInsuranceCompanyDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize);
    }

    public async Task<List<OptionDto>> GetOptionsAsync() => 
        await context.MedicalInsuranceCompanies
            .Include(x => x.MedicalInsuranceCompanyPhoto.Photo)
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<bool> ExistsByIdAsync(int id) =>
        await context.MedicalInsuranceCompanies.AsNoTracking().AnyAsync(x => x.Id == id);

    public Task<bool> ExistsByNameAsync(string name) => 
        context.MedicalInsuranceCompanies.AsNoTracking().AllAsync(x => x.Name != name);

    public Task<bool> ExistsByCodeAsync(string code) =>
        context.MedicalInsuranceCompanies.AsNoTracking().AllAsync(x => x.Code != code);

    public async Task<bool> ExistsByIdAndDoctorIdAsync(int id, int doctorId) => 
        await context.MedicalInsuranceCompanies
            .Include(x => x.DoctorMedicalInsuranceCompanies)
            .AnyAsync(x => x.Id == id && x.DoctorMedicalInsuranceCompanies.Any(y => y.DoctorId == doctorId));
}