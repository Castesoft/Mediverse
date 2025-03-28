using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Prescription;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Infrastructure.QueryExtensions;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class PrescriptionRepository(DataContext context, IMapper mapper) : IPrescriptionRepository
{
    public void Add(Prescription item)
    {
        context.Prescriptions.Add(item);
    }

    public void Delete(Prescription item)
    {
        context.Prescriptions.Remove(item);
    }

    public async Task<PrescriptionDto?> GetDtoByIdAsync(int id)
    {
        return await context.Prescriptions
            .ApplyIncludes()
            .ProjectTo<PrescriptionDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Prescription?> GetByIdAsync(int id)
    {
        return await context.Prescriptions
            .ApplyIncludes()
            .SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<PagedList<PrescriptionDto>> GetPagedListAsync(PrescriptionParams param, ClaimsPrincipal user)
    {
        var roles = user.GetRoles().ToList();
        var userId = user.GetUserId();

        param.Roles = roles;
        param.UserId = userId;

        var query = context.Prescriptions.ApplyIncludes();
        
        query = query.ApplyIncludes();
        query = query.ApplyFilters(param);
        query = query.AsQueryable();

        if (!roles.Contains("Admin"))
        {
            // Doctors can see prescriptions they created and that they are a patient of
            if (roles.Contains("Doctor"))
            {
                query = query.Where(p => (p.DoctorPrescription != null && p.DoctorPrescription.DoctorId == userId) ||
                                         (p.PatientPrescription != null && p.PatientPrescription.PatientId == userId));
            }
            // Patients can see prescriptions prescribed to them
            else
            {
                query = query.Where(p => p.PatientPrescription != null && p.PatientPrescription.PatientId == userId);
            }
        }

        return await PagedList<PrescriptionDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<PrescriptionDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize);
    }

    public async Task<Prescription?> GetByIdAsNoTrackingAsync(int id)
    {
        return await context.Prescriptions
            .ApplyIncludes()
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);
    }
}