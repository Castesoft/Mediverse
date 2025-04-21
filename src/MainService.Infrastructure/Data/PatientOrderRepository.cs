using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class PatientOrderRepository(DataContext context, IMapper mapper) : Repository<PatientOrder>(context, mapper), IPatientOrderRepository
{
    private readonly DataContext _context = context;

    public async Task<List<PatientOrder>> FindByPatientIdAsync(int patientId)
    {
        return await _context.PatientOrders
            .Where(po => po.PatientId == patientId)
            .ToListAsync();
    }
}
