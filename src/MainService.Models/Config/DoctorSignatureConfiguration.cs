using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class DoctorPhoneConfiguration : IEntityTypeConfiguration<DoctorPhone>
{
    public void Configure(EntityTypeBuilder<DoctorPhone> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.DoctorId,
                x.PhoneId
            });

        builder.HasOne(x => x.Doctor)
            .WithMany(x => x.DoctorPhones)
            .HasForeignKey(x => x.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(x => x.Phone)
            .WithOne(x => x.DoctorPhone)
            .HasForeignKey<DoctorPhone>(x => x.PhoneId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}