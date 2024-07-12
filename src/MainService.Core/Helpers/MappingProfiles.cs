using AutoMapper;
using MainService.Core.DTOs;
using MainService.Core.DTOs.Products;
using MainService.Core.DTOs.Services;
using MainService.Core.DTOs.User;
using MainService.Core.Extensions;
using MainService.Models.Entities;

namespace MainService.Core.Helpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<PatientCreateDto, AppUser>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));
        
        CreateMap<string, DateOnly>().ConvertUsing(s => DateOnly.Parse(s));
        CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        CreateMap<DateTime?, DateTime?>().ConvertUsing(d => d.HasValue 
            ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : null);

        CreateMap<ServiceCreateDto, Service>();
        
        CreateMap<AppUser, AccountDto>()
            .ForMember(dest => dest.IsEmailVerified, opt => opt.MapFrom(src => src.EmailConfirmed))
            .ForMember(dest => dest.IsPhoneNumberVerified, opt => opt.MapFrom(src => src.PhoneNumberConfirmed))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.UserPhoto.Photo.Url));

        CreateMap<AppRole, RoleDto>();
        CreateMap<AppPermission, PermissionDto>();

        CreateMap<AppUser, NurseDto>()
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.UserPhoto.Photo.Url))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth));

        CreateMap<AppUser, PatientDto>()
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.UserPhoto.Photo.Url))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
            .ForMember(dest => dest.HasAccount, opt => opt.MapFrom(src => src.Doctors.Count() > 0))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth));

        CreateMap<AppUser, UserDto>()
            .ForMember(dest => dest.IsEmailVerified, opt => opt.MapFrom(src => src.EmailConfirmed))
            .ForMember(dest => dest.IsPhoneNumberVerified, opt => opt.MapFrom(src => src.PhoneNumberConfirmed))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.UserPhoto.Photo.Url))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
            .ForMember(dest => dest.HasAccount, opt => opt.MapFrom(src => src.Doctors.Count() > 0))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()))
            .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.UserRoles.Select(x => x.Role)))
            .ForMember(dest => dest.Permissions,
                opt => opt.MapFrom(src => src.UserPermissions.Select(x => x.Permission)))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth));

        // Registration mapping
        CreateMap<RegisterDto, AppUser>();

        CreateMap<Product, ProductDto>();
        CreateMap<Service, ServiceDto>()
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.ServicePhotos.FirstOrDefault().Photo.Url));

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