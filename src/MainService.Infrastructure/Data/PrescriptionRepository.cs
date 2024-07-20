using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Prescription;
using MainService.Core.Interfaces.Data;
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
}