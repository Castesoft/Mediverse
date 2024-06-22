using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class AppUserPermissionConfiguration : IEntityTypeConfiguration<AppUserPermission>
{
    public void Configure(EntityTypeBuilder<AppUserPermission> builder)
    {
        builder
            .HasKey(x => new { x.UserId, x.PermissionId });

        builder
            .HasOne(x => x.User)
            .WithMany(x => x.UserPermissions)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        builder
            .HasOne(x => x.Permission)
            .WithMany(x => x.UserPermissions)
            .HasForeignKey(x => x.PermissionId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}