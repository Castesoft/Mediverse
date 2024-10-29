using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config
{
    public class PrescriptionClinicConfiguration : IEntityTypeConfiguration<PrescriptionClinic>
    {
        public void Configure(EntityTypeBuilder<PrescriptionClinic> builder)
        {
            builder.HasKey(x => new { x.PrescriptionId, x.ClinicId, });

            builder.HasOne(x => x.Prescription)
                .WithOne(x => x.PrescriptionClinic)
                .HasForeignKey<PrescriptionClinic>(x => x.PrescriptionId)
                .OnDelete(DeleteBehavior.NoAction)
            ;

            builder.HasOne(x => x.Clinic)
                .WithMany(x => x.PrescriptionClinics)
                .HasForeignKey(x => x.ClinicId)
                .OnDelete(DeleteBehavior.NoAction)
            ;
        }
    }
}