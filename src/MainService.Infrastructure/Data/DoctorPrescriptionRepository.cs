using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class DoctorPrescriptionRepository(DataContext context, IMapper mapper) : Repository<DoctorPrescription>(context, mapper), IDoctorPrescriptionRepository
{
    private readonly DataContext _context = context;

    public async Task<List<DoctorPrescription>> FindByDoctorIdAsync(int doctorId)
    {
        return await _context.DoctorPrescriptions
            .Where(dp => dp.DoctorId == doctorId)
            .ToListAsync();
    }
}
