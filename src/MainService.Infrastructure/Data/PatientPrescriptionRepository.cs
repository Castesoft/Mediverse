using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class PatientPrescriptionRepository(DataContext context, IMapper mapper) : Repository<PatientPrescription>(context, mapper), IPatientPrescriptionRepository
{
    private readonly DataContext _context = context;

    public async Task<List<PatientPrescription>> FindByPatientIdAsync(int patientId)
    {
        return await _context.PatientPrescriptions
            .Where(pp => pp.PatientId == patientId)
            .ToListAsync();
    }
}
