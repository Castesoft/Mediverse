using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class PatientEventRepository(DataContext context, IMapper mapper) : Repository<PatientEvent>(context, mapper), IPatientEventRepository
{
    private readonly DataContext _context = context;

    public async Task<List<PatientEvent>> FindByPatientIdAsync(int patientId)
    {
        return await _context.PatientEvents
            .Where(pe => pe.PatientId == patientId)
            .ToListAsync();
    }
}
