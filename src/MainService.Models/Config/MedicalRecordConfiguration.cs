using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config
{
    public class MedicalRecordSubstanceConfiguration : IEntityTypeConfiguration<MedicalRecordSubstance>
    {
        public void Configure(EntityTypeBuilder<MedicalRecordSubstance> builder)
        {
            builder.HasKey(x => new { x.MedicalRecordId, x.SubstanceId, x.ConsumptionLevelId });

            builder.HasOne(x => x.MedicalRecord)
                .WithMany(x => x.MedicalRecordSubstances)
                .HasForeignKey(x => x.MedicalRecordId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(x => x.Substance)
                .WithMany(x => x.MedicalRecordSubstances)
                .HasForeignKey(x => x.SubstanceId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(x => x.ConsumptionLevel)
                .WithMany(x => x.MedicalRecordSubstances)
                .HasForeignKey(x => x.ConsumptionLevelId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }

    public class MedicalRecordPersonalDiseaseConfiguration : IEntityTypeConfiguration<MedicalRecordPersonalDisease>
    {
        public void Configure(EntityTypeBuilder<MedicalRecordPersonalDisease> builder)
        {
            builder.HasKey(x => new { x.MedicalRecordId, x.DiseaseId });

            builder.HasOne(x => x.MedicalRecord)
                .WithMany(x => x.MedicalRecordPersonalDiseases)
                .HasForeignKey(x => x.MedicalRecordId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(x => x.Disease)
                .WithMany(x => x.MedicalRecordPersonalDiseases)
                .HasForeignKey(x => x.DiseaseId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }

    public class MedicalRecordFamilyDiseaseConfiguration : IEntityTypeConfiguration<MedicalRecordFamilyDisease>
    {
        public void Configure(EntityTypeBuilder<MedicalRecordFamilyDisease> builder)
        {
            builder.HasKey(x => new { x.MedicalRecordId, x.DiseaseId });

            builder.HasOne(x => x.MedicalRecord)
                .WithMany(x => x.MedicalRecordFamilyDiseases)
                .HasForeignKey(x => x.MedicalRecordId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(x => x.Disease)
                .WithMany(x => x.MedicalRecordFamilyDiseases)
                .HasForeignKey(x => x.DiseaseId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }

    public class CompanionOccupationConfiguration : IEntityTypeConfiguration<CompanionOccupation>
    {
        public void Configure(EntityTypeBuilder<CompanionOccupation> builder)
        {
            builder.HasKey(x => new { x.CompanionId, x.OccupationId });

            builder.HasOne(x => x.Companion)
                .WithOne(x => x.CompanionOccupation)
                .HasForeignKey<CompanionOccupation>(x => x.CompanionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Occupation)
                .WithMany(x => x.CompanionOccupations)
                .HasForeignKey(x => x.OccupationId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }

    public class CompanionRelativeTypeConfiguration : IEntityTypeConfiguration<CompanionRelativeType>
    {
        public void Configure(EntityTypeBuilder<CompanionRelativeType> builder)
        {
            builder.HasKey(x => new { x.CompanionId, x.RelativeTypeId });

            builder.HasOne(x => x.Companion)
                .WithOne(x => x.CompanionRelativeType)
                .HasForeignKey<CompanionRelativeType>(x => x.CompanionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.RelativeType)
                .WithOne(x => x.CompanionRelativeType)
                .HasForeignKey<CompanionRelativeType>(x => x.RelativeTypeId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }

    public class MedicalRecordCompanionConfiguration : IEntityTypeConfiguration<MedicalRecordCompanion>
    {
        public void Configure(EntityTypeBuilder<MedicalRecordCompanion> builder)
        {
            builder.HasKey(x => new { x.MedicalRecordId, x.CompanionId });

            builder.HasOne(x => x.MedicalRecord)
                .WithOne(x => x.MedicalRecordCompanion)
                .HasForeignKey<MedicalRecordCompanion>(x => x.MedicalRecordId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(x => x.Companion)
                .WithOne(x => x.MedicalRecordCompanion)
                .HasForeignKey<MedicalRecordCompanion>(x => x.CompanionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class MedicalRecordColorBlindnessConfiguration : IEntityTypeConfiguration<MedicalRecordColorBlindness>
    {
        public void Configure(EntityTypeBuilder<MedicalRecordColorBlindness> builder)
        {
            builder.HasKey(x => new { x.MedicalRecordId, x.ColorBlindnessId });

            builder.HasOne(x => x.MedicalRecord)
                .WithOne(x => x.MedicalRecordColorBlindness)
                .HasForeignKey<MedicalRecordColorBlindness>(x => x.MedicalRecordId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(x => x.ColorBlindness)
                .WithMany(x => x.MedicalRecordColorBlindnesses)
                .HasForeignKey(x => x.ColorBlindnessId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }

    public class MedicalRecordFamilyMemberConfiguration : IEntityTypeConfiguration<MedicalRecordFamilyMember>
    {
        public void Configure(EntityTypeBuilder<MedicalRecordFamilyMember> builder)
        {
            builder.HasKey(x => new { x.MedicalRecordId, x.FamilyMemberId });

            builder.HasOne(x => x.MedicalRecord)
                .WithMany(x => x.MedicalRecordFamilyMembers)
                .HasForeignKey(x => x.MedicalRecordId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(x => x.FamilyMember)
                .WithOne(x => x.MedicalRecordFamilyMember)
                .HasForeignKey<MedicalRecordFamilyMember>(x => x.FamilyMemberId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class MedicalRecordFamilyMemberRelativeTypeConfiguration : IEntityTypeConfiguration<MedicalRecordFamilyMemberRelativeType>
    {
        public void Configure(EntityTypeBuilder<MedicalRecordFamilyMemberRelativeType> builder)
        {
            builder.HasKey(x => new { x.FamilyMemberId, x.RelativeTypeId });

            builder.HasOne(x => x.FamilyMember)
                .WithOne(x => x.MedicalRecordFamilyMemberRelativeType)
                .HasForeignKey<MedicalRecordFamilyMemberRelativeType>(x => x.FamilyMemberId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.RelativeType)
                .WithOne(x => x.MedicalRecordFamilyMemberRelativeType)
                .HasForeignKey<MedicalRecordFamilyMemberRelativeType>(x => x.RelativeTypeId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
    
    public class MedicalRecordEducationLevelConfiguration : IEntityTypeConfiguration<MedicalRecordEducationLevel>
    {
        public void Configure(EntityTypeBuilder<MedicalRecordEducationLevel> builder)
        {
            builder.HasKey(x => new { x.MedicalRecordId, x.EducationLevelId });

            builder.HasOne(x => x.MedicalRecord)
                .WithOne(x => x.MedicalRecordEducationLevel)
                .HasForeignKey<MedicalRecordEducationLevel>(x => x.MedicalRecordId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(x => x.EducationLevel)
                .WithMany(x => x.MedicalRecordEducationLevels)
                .HasForeignKey(x => x.EducationLevelId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }

    public class MedicalRecordOccupationConfiguration : IEntityTypeConfiguration<MedicalRecordOccupation>
    {
        public void Configure(EntityTypeBuilder<MedicalRecordOccupation> builder)
        {
            builder.HasKey(x => new { x.MedicalRecordId, x.OccupationId });

            builder.HasOne(x => x.MedicalRecord)
                .WithOne(x => x.MedicalRecordOccupation)
                .HasForeignKey<MedicalRecordOccupation>(x => x.MedicalRecordId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(x => x.Occupation)
                .WithMany(x => x.MedicalRecordOccupations)
                .HasForeignKey(x => x.OccupationId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }

    public class MedicalRecordMaritalStatusConfiguration : IEntityTypeConfiguration<MedicalRecordMaritalStatus>
    {
        public void Configure(EntityTypeBuilder<MedicalRecordMaritalStatus> builder)
        {
            builder.HasKey(x => new { x.MedicalRecordId, x.MaritalStatusId });

            builder.HasOne(x => x.MedicalRecord)
                .WithOne(x => x.MedicalRecordMaritalStatus)
                .HasForeignKey<MedicalRecordMaritalStatus>(x => x.MedicalRecordId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(x => x.MaritalStatus)
                .WithMany(x => x.MedicalRecordMaritalStatuses)
                .HasForeignKey(x => x.MaritalStatusId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }

    public class UserMedicalRecordConfiguration : IEntityTypeConfiguration<UserMedicalRecord>
    {
        public void Configure(EntityTypeBuilder<UserMedicalRecord> builder)
        {
            builder.HasKey(x => new { x.UserId, x.MedicalRecordId });

            builder.HasOne(x => x.User)
                .WithOne(x => x.UserMedicalRecord)
                .HasForeignKey<UserMedicalRecord>(x => x.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(x => x.MedicalRecord)
                .WithOne(x => x.UserMedicalRecord)
                .HasForeignKey<UserMedicalRecord>(x => x.MedicalRecordId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
    public class MedicalRecordConfiguration : IEntityTypeConfiguration<MedicalRecord>
    {
        public void Configure(EntityTypeBuilder<MedicalRecord> builder)
        {

        }
    }
}