using AutoMapper;
using MainService.Core.DTOs.MedicalRecord;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Helpers;

public class MedicalRecordMappingProfile : Profile
{
    public MedicalRecordMappingProfile()
    {
        CreateMap<MedicalRecord, MedicalRecordDto>()
            .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.PatientName))
            .ForMember(dest => dest.Sex, opt => opt.MapFrom(src => src.GetSex()))
            .ForMember(dest => dest.HandDominance, opt => opt.MapFrom(src => src.GetHandDominance()))
            .ForMember(dest => dest.EducationLevel, opt => opt.MapFrom(src => src.MedicalRecordEducationLevel))
            .ForMember(dest => dest.Occupation, opt => opt.MapFrom(src => src.MedicalRecordOccupation.Occupation))
            .ForMember(dest => dest.ColorBlindness,
                opt => opt.MapFrom(src => src.MedicalRecordColorBlindness.ColorBlindness))
            .ForMember(dest => dest.MaritalStatus,
                opt => opt.MapFrom(src => src.MedicalRecordMaritalStatus.MaritalStatus))
            .ForMember(dest => dest.Companion, opt => opt.MapFrom(src => src.MedicalRecordCompanion))
            .ForMember(dest => dest.FamilyMembers,
                opt => opt.MapFrom(src => src.MedicalRecordFamilyMembers.Select(x => x.FamilyMember)))
            .ForMember(dest => dest.PersonalMedicalHistory,
                opt => opt.MapFrom(src => src.MedicalRecordPersonalDiseases.Select(x => x.Disease)))
            .ForMember(dest => dest.FamilyMedicalHistory, opt => opt.MapFrom(src => src.MedicalRecordFamilyDiseases))
            .ForMember(dest => dest.PersonalDrugHistory, opt => opt.MapFrom(src => src.MedicalRecordSubstances));

        CreateMap<EducationLevel, MedicalRecordEducationLevelDto>();
        CreateMap<Occupation, MedicalRecordOccupationDto>();
        CreateMap<MaritalStatus, MedicalRecordMaritalStatusDto>();
        CreateMap<ColorBlindness, MedicalRecordColorBlindnessDto>();

        CreateMap<MedicalRecordEducationLevel, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.EducationLevel.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.EducationLevel.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.EducationLevel.Code));

        CreateMap<MedicalRecordOccupation, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Occupation.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Occupation.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Occupation.Code));

        CreateMap<MedicalRecordMaritalStatus, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.MaritalStatus.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.MaritalStatus.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.MaritalStatus.Code));

        CreateMap<MedicalRecordColorBlindness, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ColorBlindness.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.ColorBlindness.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.ColorBlindness.Code));

        CreateMap<FamilyMember, MedicalRecordFamilyMemberDto>()
            .ForMember(dest => dest.RelativeType, opt => opt.MapFrom(src => src.MedicalRecordFamilyMemberRelativeType))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.Age))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id));

        CreateMap<MedicalRecordFamilyMemberRelativeType, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.RelativeType.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.RelativeType.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.RelativeType.Code));

        CreateMap<Disease, MedicalRecordPersonalDiseaseDto>()
            .ForMember(dest => dest.Disease, opt => opt.MapFrom(src => src))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id));

        CreateMap<MedicalRecordFamilyMember, MedicalRecordFamilyMemberDto>()
            .ForMember(dest => dest.RelativeType,
                opt => opt.MapFrom(src => src.FamilyMember.MedicalRecordFamilyMemberRelativeType.RelativeType))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.FamilyMember.Name))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.FamilyMember.Age))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.FamilyMember.Id));

        CreateMap<MedicalRecordCompanion, MedicalRecordCompanionDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Companion.Name))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.Companion.Age))
            .ForMember(dest => dest.Sex, opt => opt.MapFrom(src => src.Companion.GetSex()))
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Companion.Address))
            .ForMember(dest => dest.HomePhone, opt => opt.MapFrom(src => src.Companion.HomePhone))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.Companion.PhoneNumber))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Companion.Email))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Companion.Id))
            .ForMember(dest => dest.RelativeType, opt => opt.MapFrom(src => src.Companion.CompanionRelativeType))
            .ForMember(dest => dest.Occupation, opt => opt.MapFrom(src => src.Companion.CompanionOccupation));

        CreateMap<CompanionRelativeType, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.RelativeType.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.RelativeType.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.RelativeType.Code));

        CreateMap<CompanionOccupation, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Occupation.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Occupation.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Occupation.Code));

        CreateMap<MedicalRecordPersonalDisease, MedicalRecordPersonalDiseaseDto>()
            .ForMember(dest => dest.Disease, opt => opt.MapFrom(src => src.Disease))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.DiseaseId));

        CreateMap<MedicalRecordFamilyDisease, MedicalRecordFamilyDiseaseDto>()
            .ForMember(dest => dest.RelativeType, opt => opt.MapFrom(src => src.RelativeType))
            .ForMember(dest => dest.Disease, opt => opt.MapFrom(src => src.Disease));

        CreateMap<MedicalRecordSubstance, MedicalRecordSubstanceDto>();
    }
}