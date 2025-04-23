using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IInvitationRepository
{
    Task AddAsync(Invitation invitation);
    Task<Invitation?> GetByTokenAsync(string token);
    void Update(Invitation invitation);
}