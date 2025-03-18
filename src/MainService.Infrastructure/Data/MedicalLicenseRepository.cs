using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities.Aggregate;


namespace MainService.Infrastructure.Data;
public class MedicalLicenseRepository(DataContext context, IMapper mapper) : IMedicalLicenseRepository
{
    public async Task<MedicalLicenseDto?> FindDtoByNameAsync(string name) => 
        await context.MedicalLicenses.ProjectTo<MedicalLicenseDto>(mapper.ConfigurationProvider).AsNoTracking()
            .SingleOrDefaultAsync(x => x.Name == name);

    public async Task<MedicalLicense?> GetByNameAsync(string name) =>
        await context.MedicalLicenses.SingleOrDefaultAsync(x => x.Name == name);

    public async Task<MedicalLicense?> GetByCodeAsync(string code) =>
        await context.MedicalLicenses.SingleOrDefaultAsync(x => x.Code == code);

    public void Add(MedicalLicense item) => context.MedicalLicenses.Add(item);
    public void Delete(MedicalLicense item) => context.MedicalLicenses.Remove(item);

    public async Task<List<MedicalLicenseDto>> GetAllDtosAsync() => await context.MedicalLicenses
            .AsNoTracking()
            .ProjectTo<MedicalLicenseDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<MedicalLicense?> GetAsNoTrackingByIdAsync(int id) =>
        await context.MedicalLicenses
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<MedicalLicense?> GetByIdAsync(int id) =>
        await context.MedicalLicenses
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<MedicalLicenseDto?> GetDtoByIdAsync(int id) =>
        await context.MedicalLicenses
            .ProjectTo<MedicalLicenseDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<MedicalLicenseDto>> GetPagedListAsync(MedicalLicenseParams param, bool getAll = false)
    {
        IQueryable<MedicalLicense> query = context.MedicalLicenses.AsQueryable();

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

        return await PagedList<MedicalLicenseDto>.CreateAsync(
            query.ProjectTo<MedicalLicenseDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize);
    }

    public async Task<List<OptionDto>> GetOptionsAsync() => 
        await context.MedicalLicenses
            .Include(x => x.MedicalLicenseDocument.Document)
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync()
        ;

    public async Task<bool> ExistsByIdAsync(int id) =>
        await context.MedicalLicenses.AnyAsync(x => x.Id == id);

    public Task<bool> ExistsByNameAsync(string name) => 
        context.MedicalLicenses.AnyAsync(x => x.Name == name);

    public Task<bool> ExistsByCodeAsync(string code) =>
        context.MedicalLicenses.AnyAsync(x => x.Code == code);

    public async Task<bool> ExistsByIdAndDoctorIdAsync(int id, int doctorId) => 
        await context.MedicalLicenses
            .Include(x => x.MedicalLicenseSpecialty.Specialty.DoctorSpecialties)
            .AnyAsync(x => x.Id == id && x.MedicalLicenseSpecialty.Specialty.DoctorSpecialties.Any(y => y.DoctorId == doctorId));
}