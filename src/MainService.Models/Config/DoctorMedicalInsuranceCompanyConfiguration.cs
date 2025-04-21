using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class DoctorMedicalInsuranceCompanyConfiguration : IEntityTypeConfiguration<DoctorMedicalInsuranceCompany>
{
    public void Configure(EntityTypeBuilder<DoctorMedicalInsuranceCompany> builder)
    {
        builder.HasKey(x => new { x.DoctorId, x.MedicalInsuranceCompanyId });

        builder.HasOne(x => x.Doctor)
            .WithMany(x => x.DoctorMedicalInsuranceCompanies)
            .HasForeignKey(x => x.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.MedicalInsuranceCompany)
            .WithMany(x => x.DoctorMedicalInsuranceCompanies)
            .HasForeignKey(x => x.MedicalInsuranceCompanyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}