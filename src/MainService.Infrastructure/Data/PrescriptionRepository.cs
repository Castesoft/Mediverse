using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Prescription;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class PrescriptionRepository(DataContext context, IMapper mapper) : IPrescriptionRepository
{
    public void Add(Prescription item) => context.Prescriptions.Add(item);

    public void Delete(Prescription item) => context.Prescriptions.Remove(item);

    public async Task<PrescriptionDto?> GetDtoByIdAsync(int id) =>
        await context.Prescriptions
            .Include(x => x.DoctorPrescription)
            .ThenInclude(x => x.Doctor)
            .Include(x => x.PrescriptionItems)
            .ThenInclude(x => x.Item)
            .Include(x => x.EventPrescription.Event.EventClinic.Clinic.ClinicLogo.Photo)
            .Include(x => x.PatientPrescription.Patient.UserPhoto.Photo)
            .Include(x => x.PrescriptionOrder.Order)
            .Include(x => x.PrescriptionClinic.Clinic.ClinicLogo.Photo)
            .ProjectTo<PrescriptionDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<Prescription?> GetByIdAsync(int id) =>
        await context.Prescriptions
            .Include(x => x.DoctorPrescription)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<PrescriptionDto>> GetPagedListAsync(PrescriptionParams param, ClaimsPrincipal user)
    {
        var query = context.Prescriptions
            .Include(x => x.PatientPrescription)
            .ThenInclude(x => x.Patient)
            .Include(x => x.DoctorPrescription)
            .ThenInclude(x => x.Doctor)
            .Include(x => x.EventPrescription)
            .ThenInclude(ep => ep.Event)
            .ThenInclude(e => e.EventClinic)
            .ThenInclude(ec => ec.Clinic)
            .ThenInclude(c => c.ClinicLogo)
            .ThenInclude(cl => cl.Photo)
            .Include(x => x.PrescriptionItems)
            .Include(x => x.PrescriptionOrder)
            .ThenInclude(po => po.Order)
            .AsQueryable();

        var roles = user.GetRoles();
        var userId = user.GetUserId();

        query = query.Where(x => x.DoctorPrescription.Doctor.Id == userId);

        if (!string.IsNullOrEmpty(param.Search))
        {
        }

        if (param.EventId.HasValue)
        {
            query = query.Where(x => x.EventPrescription.EventId == param.EventId);
        }

        return await PagedList<PrescriptionDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<PrescriptionDto>(mapper.ConfigurationProvider),
            param.PageNumber, param.PageSize);
    }

    public async Task<Prescription?> GetByIdAsNoTrackingAsync(int id) =>
        await context.Prescriptions
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);
}

public static class PrescriptionRepositoryExtensions
{
    public static IQueryable<Prescription> ApplyFilters(this IQueryable<Prescription> query, PrescriptionParams param) {
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
                    !string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term)
            );
        }

        return query;
    }
}