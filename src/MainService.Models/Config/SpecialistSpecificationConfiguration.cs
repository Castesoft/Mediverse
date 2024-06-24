using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class SpecialistSpecificationConfiguration : IEntityTypeConfiguration<SpecialistSpecification>
{
    public void Configure(EntityTypeBuilder<SpecialistSpecification> builder)
    {
        
    }
}