using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class UserMedicalRecordRepository(DataContext context, IMapper mapper) : Repository<UserMedicalRecord>(context, mapper), IUserMedicalRecordRepository
{
    private readonly DataContext _context = context;

    public async Task<List<UserMedicalRecord>> FindByUserIdAsync(int userId)
    {
        return await _context.UserMedicalRecords
            .Where(umr => umr.UserId == userId)
            .ToListAsync();
    }
}
