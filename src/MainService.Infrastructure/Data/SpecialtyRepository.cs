using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;
public class SpecialtyRepository(DataContext context) : ISpecialtyRepository
{
    public async Task<Specialty> GetByIdAsync(int id) =>
        await context.Specialties.SingleOrDefaultAsync(x => x.Id == id);
}