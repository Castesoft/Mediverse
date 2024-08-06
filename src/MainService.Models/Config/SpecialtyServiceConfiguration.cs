using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class SpecialtyServiceConfiguration : IEntityTypeConfiguration<SpecialtyService>
{
    public void Configure(EntityTypeBuilder<SpecialtyService> builder)
    {
        builder.HasKey(x => new { x.SpecialtyId, x.ServiceId });
    }
}