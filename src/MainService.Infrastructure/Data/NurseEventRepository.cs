using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class NurseEventRepository(DataContext context, IMapper mapper) : Repository<NurseEvent>(context, mapper), INurseEventRepository
{
    private readonly DataContext _context = context;


    public async Task<List<NurseEvent>> FindByNurseIdAsync(int nurseId)
    {
        return await _context.NurseEvents
            .Where(ne => ne.NurseId == nurseId)
            .ToListAsync();
    }
}