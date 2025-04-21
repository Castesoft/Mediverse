using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class DoctorEventRepository(DataContext context, IMapper mapper) : Repository<DoctorEvent>(context, mapper), IDoctorEventRepository
{
    private readonly DataContext _context = context;
    public async Task<List<DoctorEvent>> FindByDoctorIdAsync(int doctorId)
    {
        return await _context.DoctorEvents
            .Where(de => de.DoctorId == doctorId)
            .ToListAsync();
    }
}
