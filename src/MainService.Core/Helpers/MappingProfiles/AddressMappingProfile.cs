using AutoMapper;
using MainService.Core.DTOs.Addresses;
using MainService.Core.DTOs.Clinics;
using MainService.Core.DTOs.User;
using MainService.Core.Helpers.Resolvers;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Helpers.MappingProfiles;

public class AddressMappingProfile : Profile
{
    public AddressMappingProfile()
    {
        // Map Address to ClinicDto.
        CreateMap<Address, ClinicDto>()
            .ForMember(dest => dest.IsMain,
                opt => opt.MapFrom(src => src.DoctorClinic != null ? src.DoctorClinic.IsMain : false))
            .ForMember(dest => dest.NursesCount, opt => opt.MapFrom(src => src.ClinicNurses.Count))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom<ClinicLogoUrlResolver>());

        // Map Address to AddressDto.
        CreateMap<Address, AddressDto>()
            .ForMember(dest => dest.IsMain,
                opt => opt.MapFrom(src => src.DoctorClinic != null ? src.DoctorClinic.IsMain : false))
            .ForMember(dest => dest.NursesCount, opt => opt.MapFrom(src => src.ClinicNurses.Count));

        // Map Address to OptionDto.
        CreateMap<Address, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name,
                opt => opt.MapFrom(src => $"{src.Street}, {src.City}, {src.State}, {src.Country}"))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Id.ToString()))
            .ForMember(dest => dest.Options, opt => opt.MapFrom(src => new Options
            {
                PhotoUrl = src.ClinicLogo.Photo.Url != null ? src.ClinicLogo.Photo.Url.AbsoluteUri : null,
            }));

        // Map UserAddressCreateDto and UserAddressUpdateDto to Address.
        CreateMap<UserAddressCreateDto, Address>();
        CreateMap<UserAddressUpdateDto, Address>();

        // Map ClinicCreateDto to Address.
        CreateMap<ClinicCreateDto, Address>();
    }
}