using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class EventMedicalInsuranceCompanyConfiguration : IEntityTypeConfiguration<EventMedicalInsuranceCompany>
{
    public void Configure(EntityTypeBuilder<EventMedicalInsuranceCompany> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.EventId,
                x.MedicalInsuranceCompanyId
            });

        builder.HasOne(x => x.Event)
            .WithOne(x => x.EventMedicalInsuranceCompany)
            .HasForeignKey<EventMedicalInsuranceCompany>(x => x.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.MedicalInsuranceCompany)
            .WithMany(x => x.EventMedicalInsuranceCompanies)
            .HasForeignKey(x => x.MedicalInsuranceCompanyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}