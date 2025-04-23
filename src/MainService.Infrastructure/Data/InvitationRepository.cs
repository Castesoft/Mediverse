using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
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