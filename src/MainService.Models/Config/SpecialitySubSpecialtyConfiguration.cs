using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class SpecialitySubSpecialtyConfiguration : IEntityTypeConfiguration<SpecialitySubSpecialty>
{
    public void Configure(EntityTypeBuilder<SpecialitySubSpecialty> builder)
    {
        builder.HasKey(x => new { x.SpecialtyId, x.SubSpecialtyId });
    }
}