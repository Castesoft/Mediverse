using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IInvitationRepository
{
    Task AddAsync(Invitation invitation);
    Task<Invitation?> GetByTokenAsync(string token);
    Task<Invitation?> GetPendingInvitationAsync(int invitingUserId, string inviteeEmail, string roleInvitedAs);
    Task<Invitation?> GetByTokenAsync(string token, bool includeInvitingUser = false);
    void Update(Invitation invitation);
}