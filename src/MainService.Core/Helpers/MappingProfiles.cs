using AutoMapper;
using MainService.Core.DTOs;
using MainService.Core.DTOs.Patients;
using MainService.Core.DTOs.Products;
using MainService.Models.Entities;

namespace MainService.Core.Helpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<AppUser, AccountDto>()
            .ForMember(dest => dest.IsEmailVerified, opt => opt.MapFrom(src => src.EmailConfirmed))
            .ForMember(dest => dest.IsPhoneNumberVerified, opt => opt.MapFrom(src => src.PhoneNumberConfirmed))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.UserPhoto.Photo.Url));

        CreateMap<AppRole, RoleDto>();
        CreateMap<AppPermission, PermissionDto>();

        CreateMap<AppUser, UserDto>()
            .ForMember(dest => dest.IsEmailVerified, opt => opt.MapFrom(src => src.EmailConfirmed))
            .ForMember(dest => dest.IsPhoneNumberVerified, opt => opt.MapFrom(src => src.PhoneNumberConfirmed))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.UserPhoto.Photo.Url))
            .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.UserRoles.Select(x => x.Role)))
            .ForMember(dest => dest.Permissions,
                opt => opt.MapFrom(src => src.UserPermissions.Select(x => x.Permission)));
        CreateMap<AppUser, PatientDto>()
            .ForMember(dest => dest.IsEmailVerified, opt => opt.MapFrom(src => src.EmailConfirmed))
            .ForMember(dest => dest.IsPhoneNumberVerified, opt => opt.MapFrom(src => src.PhoneNumberConfirmed))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.UserPhoto.Photo.Url))
            .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.UserRoles.Select(x => x.Role)))
            .ForMember(dest => dest.Permissions,
                opt => opt.MapFrom(src => src.UserPermissions.Select(x => x.Permission)))
            .ForMember(dest => dest.BirthDate, opt => opt.MapFrom(src => src.DateOfBirth));

        // Registration mapping
        CreateMap<RegisterDto, AppUser>();

        CreateMap<Product, ProductDto>();

        CreateMap<Location, PrescriptionInformationDto>()
            .ForMember(dest => dest.ExteriorNumber, opt => opt.MapFrom(src => src.ExteriorNumber))
            .ForMember(dest => dest.InteriorNumber, opt => opt.MapFrom(src => src.InteriorNumber))
            .ForMember(dest => dest.Street, opt => opt.MapFrom(src => src.Street))
            .ForMember(dest => dest.ZipCode, opt => opt.MapFrom(src => src.ZipCode))
            .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City))
            .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State))
            .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Country))
            .ForMember(dest => dest.Neighborhood, opt => opt.MapFrom(src => src.Neighborhood))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.PhotoUrl))
            .ForMember(dest => dest.Phones,
                opt => opt.MapFrom(src => src.LocationPhones.Select(y => y.Phone.PhoneNumber)));
    }
}