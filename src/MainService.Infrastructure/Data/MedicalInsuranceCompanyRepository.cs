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

        if (!string.IsNullOrEmpty(param.Name)) query = query.Where(x => x.Name.Contains(param.Name));
        if (!string.IsNullOrEmpty(param.Code)) query = query.Where(x => x.Code.Contains(param.Code));
        if (!string.IsNullOrEmpty(param.LastName)) query = query.Where(x => x.LastName.Contains(param.LastName));
        if (!string.IsNullOrEmpty(param.Description)) query = query.Where(x => x.Description.Contains(param.Description));
        if (!string.IsNullOrEmpty(param.Color)) query = query.Where(x => x.Color.Contains(param.Color));
        if (param.CodeNumber > 0) query = query.Where(x => x.CodeNumber == param.CodeNumber);

        if (param.Sort != null && !string.IsNullOrEmpty(param.Sort.Code))
        {
            query = param.Sort.Code.ToLower() switch
            {
                "id" => param.IsSortAscending
                                        ? query.OrderBy(x => x.Id)
                                        : query.OrderByDescending(x => x.Id),
                "name" => param.IsSortAscending
                                        ? query.OrderBy(x => x.Name)
                                        : query.OrderByDescending(x => x.Name),
                "lastname" => param.IsSortAscending
                                        ? query.OrderBy(x => x.LastName)
                                        : query.OrderByDescending(x => x.LastName),
                "code" => param.IsSortAscending
                                        ? query.OrderBy(x => x.Code)
                                        : query.OrderByDescending(x => x.Code),
                "codenumber" => param.IsSortAscending
                                        ? query.OrderBy(x => x.CodeNumber)
                                        : query.OrderByDescending(x => x.CodeNumber),
                "color" => param.IsSortAscending
                                        ? query.OrderBy(x => x.Color)
                                        : query.OrderByDescending(x => x.Color),
                "description" => param.IsSortAscending
                                        ? query.OrderBy(x => x.Description)
                                        : query.OrderByDescending(x => x.Description),
                _ => query.OrderBy(x => x.Id),
            };
        }

        if (!string.IsNullOrEmpty(param.Search))
        {
            query = query.Where(
                x => EF.Functions.Like(x.Name.ToLower(), $"%{param.Search}%")
                     || EF.Functions.Like(x.Code.ToLower(), $"%{param.Search}%")
                     || EF.Functions.Like(x.CodeNumber.ToString(), $"%{param.Search}%")
                     || EF.Functions.Like(x.Color.ToString(), $"%{param.Search}%")
                     || EF.Functions.Like(x.Description.ToString(), $"%{param.Search}%")
                     || EF.Functions.Like(x.LastName.ToString(), $"%{param.Search}%")
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