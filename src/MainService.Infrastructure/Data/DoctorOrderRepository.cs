using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class DoctorOrderRepository(DataContext context, IMapper mapper) : Repository<DoctorOrder>(context, mapper), IDoctorOrderRepository
{
    private readonly DataContext _context = context;
    public async Task<List<DoctorOrder>> FindByDoctorIdAsync(int doctorId)
    {
        return await _context.DoctorOrders
            .Where(order => order.DoctorId == doctorId)
            .ToListAsync();
    }
}
