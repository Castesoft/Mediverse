using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class DoctorNurseRepository(DataContext context, IMapper mapper) : Repository<DoctorNurse>(context, mapper), IDoctorNurseRepository
{
    private readonly DataContext _context = context;
    public async Task<List<DoctorNurse>> FindByDoctorIdAsync(int doctorId)
    {
        return await _context.DoctorNurses
            .Where(order => order.DoctorId == doctorId)
            .ToListAsync();
    }

    public Task<DoctorNurse?> FindByCompositeKeyAsync(int doctorId, int nurseId)
    {
        return _context.DoctorNurses
            .FirstOrDefaultAsync(order => order.DoctorId == doctorId && order.NurseId == nurseId);
    }
}
