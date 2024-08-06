using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;
public interface ISpecialtyRepository
{
    Task<Specialty> GetByIdAsync(int id);
}