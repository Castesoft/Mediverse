using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;

public interface IRoleRepository
{
    Task<List<OptionDto>> GetUserRoles();
}