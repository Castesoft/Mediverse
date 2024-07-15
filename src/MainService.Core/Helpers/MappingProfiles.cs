using AutoMapper;
using MainService.Core.DTOs;
using MainService.Core.DTOs.Addresses;
using MainService.Core.DTOs.Events;
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
        CreateMap<Address, AddressDto>()
            .ForMember(dest => dest.IsMain, opt => opt.MapFrom(src => src.DoctorClinic.IsMain))
            .ForMember(dest => dest.NursesCount, opt => opt.MapFrom(src => src.ClinicNurses.Count));

        CreateMap<ClinicCreateDto, Address>();

        CreateMap<PatientCreateDto, AppUser>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));

        CreateMap<string, DateOnly>().ConvertUsing(s => DateOnly.Parse(s));
        CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        CreateMap<DateTime?, DateTime?>().ConvertUsing(d => d.HasValue
            ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc)
            : null);

        CreateMap<ServiceCreateDto, Service>();

        CreateMap<AppUser, AccountDto>()
            .ForMember(dest => dest.IsEmailVerified, opt => opt.MapFrom(src => src.EmailConfirmed))
            .ForMember(dest => dest.IsPhoneNumberVerified, opt => opt.MapFrom(src => src.PhoneNumberConfirmed))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.UserPhoto.Photo.Url));

        CreateMap<EventClinic, AddressDto>();
        CreateMap<EventService, ServiceDto>();
            
        CreateMap<DoctorEvent, DoctorDto>();
        CreateMap<PatientEvent, UserDto>();
        CreateMap<NurseEvent, NurseDto>();

        CreateMap<Event, EventDto>()
            .ForMember(dest => dest.Service, opt => opt.MapFrom(src => src.EventService.Service))
            .ForMember(dest => dest.Clinic, opt => opt.MapFrom(src => src.EventClinic.Clinic))
            .ForMember(dest => dest.Doctor, opt => opt.MapFrom(src => src.DoctorEvent.Doctor))
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.PatientEvent.Patient))
            .ForMember(dest => dest.Nurses, opt => opt.MapFrom(src => src.NurseEvents.Select(x => x.Nurse)))
            .ForMember(dest => dest.DateFrom, opt => opt.MapFrom(src => src.DateFrom))
            .ForMember(dest => dest.DateTo, opt => opt.MapFrom(src => src.DateTo));

        CreateMap<AppRole, RoleDto>();
        CreateMap<AppUser, DoctorDto>();
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
            .ForMember(dest => dest.Street,
                opt => opt.MapFrom(src => src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.Street))
            .ForMember(dest => dest.InteriorNumber,
                opt => opt.MapFrom(src => src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.InteriorNumber))
            .ForMember(dest => dest.ExteriorNumber,
                opt => opt.MapFrom(src => src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.ExteriorNumber))
            .ForMember(dest => dest.City,
                opt => opt.MapFrom(src => src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.City))
            .ForMember(dest => dest.State,
                opt => opt.MapFrom(src => src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.State))
            .ForMember(dest => dest.Country,
                opt => opt.MapFrom(src => src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.Country))
            .ForMember(dest => dest.Zipcode,
                opt => opt.MapFrom(src => src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.Zipcode))
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
    }
}