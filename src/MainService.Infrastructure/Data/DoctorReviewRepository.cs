using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class DoctorReviewRepository(DataContext context, IMapper mapper) : Repository<DoctorReview>(context, mapper), IDoctorReviewRepository
{
    private readonly DataContext _context = context;

    public async Task<List<DoctorReview>> FindByDoctorIdAsync(int doctorId)
    {
        return await _context.DoctorReviews
            .Where(dr => dr.DoctorId == doctorId)
            .ToListAsync();
    }
}
