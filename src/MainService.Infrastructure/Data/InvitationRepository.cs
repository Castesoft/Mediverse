using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using MainService.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class InvitationRepository(DataContext context) : IInvitationRepository
{
    public async Task AddAsync(Invitation invitation)
    {
        await context.Invitations.AddAsync(invitation);
    }

    public async Task<Invitation?> GetByTokenAsync(string token)
    {
        return await context.Invitations
            .Include(i => i.InvitingUser)
            .FirstOrDefaultAsync(i => i.Token == token);
    }

    public async Task<Invitation?> GetPendingInvitationAsync(int invitingUserId, string inviteeEmail,
        string roleInvitedAs)
    {
        return await context.Invitations
            .Where(i =>
                i.InvitingUserId == invitingUserId &&
                i.InviteeEmail.ToLower() == inviteeEmail.ToLower() &&
                i.RoleInvitedAs == roleInvitedAs &&
                i.Status == InvitationStatus.Pending &&
                i.ExpiryDate > DateTime.UtcNow
            )
            .FirstOrDefaultAsync();
    }

    public async Task<Invitation?> GetByTokenAsync(string token, bool includeInvitingUser = false)
    {
        var query = context.Invitations.AsQueryable();

        if (includeInvitingUser)
        {
            query = query
                .Include(i => i.InvitingUser)
                .ThenInclude(i => i.UserPhoto)
                .ThenInclude(i => i.Photo);
        }

        return await query.FirstOrDefaultAsync(i => i.Token == token);
    }

    public void Update(Invitation invitation)
    {
        var local = context.Set<Invitation>()
            .Local
            .FirstOrDefault(entry => entry.Id.Equals(invitation.Id));

        if (local != null)
        {
            context.Entry(local).State = EntityState.Detached;
        }

        context.Entry(invitation).State = EntityState.Modified;
    }
}