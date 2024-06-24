using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class DoctorSignatureConfiguration : IEntityTypeConfiguration<DoctorSignature>
{
    public void Configure(EntityTypeBuilder<DoctorSignature> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.DoctorId,
                x.SignatureId
            });

        builder.HasOne(x => x.Doctor)
            .WithOne(x => x.DoctorSignature)
            .HasForeignKey<DoctorSignature>(x => x.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(x => x.Signature)
            .WithOne(x => x.DoctorSignature)
            .HasForeignKey<DoctorSignature>(x => x.SignatureId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}