using AutoMapper;
using MainService.Core.DTOs;
using MainService.Core.DTOs.Addresses;
using MainService.Core.DTOs.Events;
using MainService.Core.DTOs.Orders;
using MainService.Core.DTOs.Prescription;
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
        CreateMap<ProductCreateDto, Product>();

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

        CreateMap<AppUser, UserSummaryDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.UserPhoto.Photo.Url));

        CreateMap<Event, EventDto>()
            .ForMember(dest => dest.Service, opt => opt.MapFrom(src => src.EventService.Service))
            .ForMember(dest => dest.Clinic, opt => opt.MapFrom(src => src.EventClinic.Clinic))
            .ForMember(dest => dest.Doctor, opt => opt.MapFrom(src => src.DoctorEvent.Doctor))
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.PatientEvent.Patient))
            .ForMember(dest => dest.Nurses, opt => opt.MapFrom(src => src.NurseEvents.Select(x => x.Nurse)))
            .ForMember(dest => dest.DateFrom, opt => opt.MapFrom(src => src.DateFrom))
            .ForMember(dest => dest.DateTo, opt => opt.MapFrom(src => src.DateTo));

        CreateMap<Event, EventSummaryDto>()
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.PatientEvent.Patient))
            .ForMember(dest => dest.DateFrom, opt => opt.MapFrom(src => src.DateFrom))
            .ForMember(dest => dest.DateTo, opt => opt.MapFrom(src => src.DateTo));

        CreateMap<Prescription, PrescriptionDto>()
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.PatientPrescription.Patient))
            .ForMember(dest => dest.Doctor, opt => opt.MapFrom(src => src.DoctorPrescription.Doctor))
            .ForMember(dest => dest.Event, opt => opt.MapFrom(src => src.EventPrescription.Event))
            .ForMember(dest => dest.Clinic, opt => opt.MapFrom(src => src.EventPrescription.Event.EventClinic.Clinic))
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.PrescriptionItems));

        CreateMap<PrescriptionItem, PrescriptionItemDto>()
            .ForMember(dest => dest.Dosage, opt => opt.MapFrom(src => src.Dosage))
            .ForMember(dest => dest.Instructions, opt => opt.MapFrom(src => src.Instructions))
            .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes))
            .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
            .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Item.Unit))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Item.Name))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Item.Description))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Item.Price))
            .ForMember(dest => dest.Discount, opt => opt.MapFrom(src => src.Item.Discount))
            .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom(src => src.Item.Manufacturer))
            .ForMember(dest => dest.LotNumber, opt => opt.MapFrom(src => src.Item.LotNumber))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.Item.CreatedAt));

        CreateMap<Order, OrderDto>()
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.OrderAddress.Address))
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.PatientOrder.Patient))
            .ForMember(dest => dest.Doctor, opt => opt.MapFrom(src => src.DoctorOrder.Doctor))
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.OrderItems))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString().ToLower()))
            .ForMember(dest => dest.DeliveryStatus, opt => opt.MapFrom(src => src.DeliveryStatus.ToString().ToLower()));

        CreateMap<OrderItem, OrderItemDto>()
            .ForMember(dest => dest.Dosage, opt => opt.MapFrom(src => src.Dosage))
            .ForMember(dest => dest.Instructions, opt => opt.MapFrom(src => src.Instructions))
            .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes))
            .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
            .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Item.Unit))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Item.Name))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Item.Description))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Item.Price))
            .ForMember(dest => dest.Discount, opt => opt.MapFrom(src => src.Item.Discount))
            .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom(src => src.Item.Manufacturer))
            .ForMember(dest => dest.LotNumber, opt => opt.MapFrom(src => src.Item.LotNumber));

        CreateMap<OrderItem, PrescriptionItemDto>()
            .ForMember(dest => dest.Dosage, opt => opt.MapFrom(src => src.Dosage))
            .ForMember(dest => dest.Instructions, opt => opt.MapFrom(src => src.Instructions))
            .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes))
            .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
            .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Item.Unit))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Item.Name))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Item.Description))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Item.Price))
            .ForMember(dest => dest.Discount, opt => opt.MapFrom(src => src.Item.Discount))
            .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom(src => src.Item.Manufacturer))
            .ForMember(dest => dest.LotNumber, opt => opt.MapFrom(src => src.Item.LotNumber));

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
        CreateMap<Product, ProductSummaryDto>();
        CreateMap<Service, ServiceDto>()
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.ServicePhotos.FirstOrDefault().Photo.Url));
    }
}