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

    public async Task<PrescriptionDto> GetDtoByIdAsync(int id)
    {
        return await context.Prescriptions
            .Include(x => x.DoctorPrescription).ThenInclude(x => x.Doctor)
            .Include(x => x.PrescriptionItems).ThenInclude(x => x.Item)
            .Include(x => x.EventPrescription).ThenInclude(x => x.Event).ThenInclude(x => x.EventClinic)
            .ThenInclude(x => x.Clinic)
            .Include(x => x.PatientPrescription).ThenInclude(x => x.Patient)
            .ProjectTo<PrescriptionDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Prescription> GetByIdAsync(int id)
    {
        var item = await context.Prescriptions
            .Include(x => x.DoctorPrescription)
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<PagedList<PrescriptionDto>> GetPagedListAsync(PrescriptionParams param, ClaimsPrincipal user)
    {
        var query = context.Prescriptions
            .Include(x => x.PatientPrescription)
            .ThenInclude(x => x.Patient)
            .Include(x => x.DoctorPrescription)
            .ThenInclude(x => x.Doctor)
            .Include(x => x.EventPrescription)
            .ThenInclude(x => x.Event)
            .Include(x => x.PrescriptionItems)
            .Include(x => x.PrescriptionOrder)
            .ThenInclude(x => x.Order)
            .AsQueryable();

        IEnumerable<string> roles = user.GetRoles();
        int userId = user.GetUserId();

        query = query.Where(x => x.DoctorPrescription.Doctor.Id == userId);

        if (!string.IsNullOrEmpty(param.Search))
        {
            query = query.Where(x =>
                EF.Functions.Like(x.PatientPrescription.Patient.FirstName.ToLower(), $"%{param.Search}%") ||
                EF.Functions.Like(x.PatientPrescription.Patient.LastName.ToLower(), $"%{param.Search}%") ||
                EF.Functions.Like(x.PatientPrescription.Patient.Email.ToLower(), $"%{param.Search}%") ||
                EF.Functions.Like(x.Notes.ToLower(), $"%{param.Search}%"));
        }

        return await PagedList<PrescriptionDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<PrescriptionDto>(mapper.ConfigurationProvider),
            param.PageNumber, param.PageSize);
    }

    public async Task<Prescription> GetByIdAsNoTrackingAsync(int id)
    {
        var item = await context.Prescriptions
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }
}