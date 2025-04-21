using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface INurseEventRepository : IRepository<NurseEvent>
{
    Task<List<NurseEvent>> FindByNurseIdAsync(int nurseId);
}