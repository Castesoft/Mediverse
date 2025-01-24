using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class RoleRepository(DataContext context, IMapper mapper) : IRoleRepository
{
    public async Task<List<OptionDto>> GetUserRoles()
    {
        var roles = await context.Roles.ToListAsync();
        return mapper.Map<List<AppRole>, List<OptionDto>>(roles);
    }
}