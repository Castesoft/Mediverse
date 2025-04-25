using AutoMapper;
using MainService.Core.DTOs.DoctorNurses;
using MainService.Models.Entities;

namespace MainService.Core.Helpers.MappingProfiles;

public class DoctorNurseMappingProfile : Profile
{
    public DoctorNurseMappingProfile()
    {
        CreateMap<DoctorNurse, DoctorNurseDto>()
            .ForMember(dest => dest.DoctorId, opt => opt.MapFrom(src => src.DoctorId))
            .ForMember(dest => dest.NurseId, opt => opt.MapFrom(src => src.NurseId))
            .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src =>
                (src.Doctor != null) ? $"{src.Doctor.FirstName} {src.Doctor.LastName}".Trim() : null))
            .ForMember(dest => dest.DoctorEmail, opt => opt.MapFrom(src =>
                (src.Doctor != null) ? src.Doctor.Email : null))
            .ForMember(dest => dest.DoctorPhotoUrl, opt => opt.MapFrom(src =>
                (src.Doctor != null) ? src.Doctor.GetPhotoUrl() : null))
            .ForMember(dest => dest.DoctorSpecialty, opt => opt.MapFrom(src =>
                (src.Doctor != null && src.Doctor.DoctorSpecialty != null &&
                 src.Doctor.DoctorSpecialty.Specialty != null)
                    ? src.Doctor.DoctorSpecialty.Specialty.Name
                    : null))
            .ForMember(dest => dest.NurseName, opt => opt.MapFrom(src =>
                (src.Nurse != null) ? $"{src.Nurse.FirstName} {src.Nurse.LastName}".Trim() : null))
            .ForMember(dest => dest.NurseEmail, opt => opt.MapFrom(src =>
                (src.Nurse != null) ? src.Nurse.Email : null))
            .ForMember(dest => dest.NursePhotoUrl, opt => opt.MapFrom(src =>
                (src.Nurse != null) ? src.Nurse.GetPhotoUrl() : null))
            .ForMember(dest => dest.AssociationDate, opt => opt.MapFrom(src => src.CreatedAt));
    }
}