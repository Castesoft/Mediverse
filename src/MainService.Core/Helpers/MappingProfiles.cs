using AutoMapper;
using MainService.Core.DTOs;
using MainService.Core.DTOs.Addresses;
using MainService.Core.DTOs.Events;
using MainService.Core.DTOs.Orders;
using MainService.Core.DTOs.Prescription;
using MainService.Core.DTOs.Products;
using MainService.Core.DTOs.Search;
using MainService.Core.DTOs.Services;
using MainService.Core.DTOs.User;
using MainService.Core.Extensions;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Helpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<AppUser, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Options, opt => opt.MapFrom(src => new Options()
            {
                Id = src.Id,
                PhotoUrl = src.UserPhoto.Photo.Url,
                Sex = src.Sex,
            }));
        ;
        
        CreateMap<AppUser, DoctorSearchResultDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.UserPhoto.Photo.Url))
            .ForMember(dest => dest.Specialties, opt => opt.MapFrom(src => src.UserMedicalLicenses.Select(x => x.MedicalLicense.MedicalLicenseSpecialty.Specialty)))
            .ForMember(dest => dest.Addresses, opt => opt.MapFrom(src => src.DoctorClinics.Select(x => x.Clinic)))
            .ForMember(dest => dest.PaymentMethods, opt => opt.MapFrom(src => src.DoctorPaymentMethodTypes.Select(x => x.PaymentMethodType)))
            .ForMember(dest => dest.Services, opt => opt.MapFrom(src => src.DoctorServices.Select(x => x.Service)))
            .ForMember(dest => dest.MedicalInsuranceCompanies, opt => opt.MapFrom(src => src.UserMedicalInsuranceCompanies.Select(x => x.MedicalInsuranceCompany)))
            .ForMember(dest => dest.WorkSchedules, opt => opt.MapFrom(src => src.DoctorWorkSchedules.Select(x => x.WorkSchedule)))
            .ForMember(dest => dest.DoctorEvents, opt => opt.MapFrom(src => src.DoctorEvents.Select(x => x.Event)))
            .ForMember(dest => dest.Reviews, opt => opt.MapFrom(src => src.DoctorReviews.Select(x => x.Review)))
            .ForMember(dest => dest.MedicalInsuranceCompanies, opt => opt.MapFrom(src => src.DoctorMedicalInsuranceCompanies.Select(x => x.MedicalInsuranceCompany)));

        CreateMap<Review, DoctorReviewDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserReview.User.FirstName + " " + src.UserReview.User.LastName))
            .ForMember(dest => dest.UserPhotoUrl, opt => opt.MapFrom(src => src.UserReview.User.UserPhoto.Photo.Url))
            .ForMember(dest => dest.Comment, opt => opt.MapFrom(src => src.Content))
            .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Rating))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt));

        CreateMap<Address, DoctorClinicDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.IsMain, opt => opt.MapFrom(src => src.DoctorClinic.IsMain))
            .ForMember(dest => dest.Street, opt => opt.MapFrom(src => src.Street))
            .ForMember(dest => dest.Neighborhood, opt => opt.MapFrom(src => src.Neighborhood))
            .ForMember(dest => dest.ExteriorNumber, opt => opt.MapFrom(src => src.ExteriorNumber))
            .ForMember(dest => dest.InteriorNumber, opt => opt.MapFrom(src => src.InteriorNumber))
            .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City))
            .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State))
            .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Country))
            .ForMember(dest => dest.Zipcode, opt => opt.MapFrom(src => src.Zipcode))
            .ForMember(dest => dest.LogoUrl, opt => opt.MapFrom(src => src.ClinicLogo.Photo.Url));

        CreateMap<Event, SatisfactionSurveyDto>()
            .ForMember(dest => dest.EventId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => src.DoctorEvent.Doctor.FirstName + " " + src.DoctorEvent.Doctor.LastName))
            .ForMember(dest => dest.ServiceName, opt => opt.MapFrom(src => src.EventService.Service.Name))
            .ForMember(dest => dest.DateFrom, opt => opt.MapFrom(src => src.DateFrom))
            .ForMember(dest => dest.DateTo, opt => opt.MapFrom(src => src.DateTo));

        CreateMap<Address, AddressDto>()
            .ForMember(dest => dest.IsMain, opt => opt.MapFrom(src => src.DoctorClinic.IsMain))
            .ForMember(dest => dest.NursesCount, opt => opt.MapFrom(src => src.ClinicNurses.Count));

        CreateMap<UserAddressCreateDto, Address>();
        CreateMap<UserAddressUpdateDto, Address>();

        CreateMap<ClinicCreateDto, Address>();

        CreateMap<PatientCreateDto, AppUser>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));

        CreateMap<Payment, PaymentDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Amount, opt => opt.MapFrom(src => src.Amount))
            .ForMember(dest => dest.PaymentDate, opt => opt.MapFrom(src => src.CreatedAt))
            .ForMember(dest => dest.PaymentMethod, opt => opt.MapFrom(src => src.PaymentPaymentMethod.PaymentMethod))
            .ForMember(dest => dest.PaymentMethodType, opt => opt.MapFrom(src => src.PaymentPaymentMethodType.PaymentMethodType))
            .ForMember(dest => dest.DoctorId, opt => opt.MapFrom(src => src.EventPayment.Event.DoctorEvent.Doctor.Id));

        CreateMap<string, DateOnly>().ConvertUsing(s => DateOnly.Parse(s));
        CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        CreateMap<DateTime?, DateTime?>().ConvertUsing(d => d.HasValue
            ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc)
            : null);

        CreateMap<ServiceCreateDto, Service>();
        CreateMap<ProductCreateDto, Product>();

        CreateMap<AppUser, AccountDto>()
            .ForMember(dest => dest.Sex, opt => opt.MapFrom(src => src.GetSex()))
            .ForMember(dest => dest.MedicalLicenses, opt => opt.MapFrom(src => src.UserMedicalLicenses))
            .ForMember(dest => dest.IsEmailVerified, opt => opt.MapFrom(src => src.EmailConfirmed))
            .ForMember(dest => dest.IsPhoneNumberVerified, opt => opt.MapFrom(src => src.PhoneNumberConfirmed))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.UserPhoto.Photo.Url))
            .ForMember(dest => dest.BannerUrl, opt => opt.MapFrom(src => src.DoctorBannerPhoto.Photo.Url))
            .ForMember(dest => dest.MainSpecialty, opt => opt.MapFrom(src => src.UserMedicalLicenses.FirstOrDefault(x => x.IsMain).MedicalLicense.MedicalLicenseSpecialty.Specialty.Name))
            .ForMember(dest => dest.SpecialtyId, opt => opt.MapFrom(src => src.UserMedicalLicenses.FirstOrDefault(x => x.IsMain).MedicalLicense.MedicalLicenseSpecialty.Specialty.Id))
            .ForMember(dest => dest.PaymentMethodTypes, opt => opt.MapFrom(src => src.DoctorPaymentMethodTypes.Select(x => x.PaymentMethodType)))
            .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.State))
            .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.City))
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.UserAddresses.FirstOrDefault(x => x.IsMain).Address.Street))
            .ForMember(dest => dest.WorkSchedules, opt => opt.MapFrom(src => src.DoctorWorkSchedules.Select(x => x.WorkSchedule)))
            .ForMember(dest => dest.WorkScheduleSettings, opt => opt.MapFrom(src => src.DoctorWorkScheduleSettings.WorkScheduleSettings))
            .ForMember(dest => dest.DoctorClinics, opt => opt.MapFrom(src => src.DoctorClinics.Select(x => x.Clinic)))
            .ForMember(dest => dest.SharedDoctors, opt => opt.MapFrom(src => src.Doctors.Select(x => x.Doctor)))
            .ForMember(dest => dest.MedicalInsuranceCompanies, opt => opt.MapFrom(src => src.UserMedicalInsuranceCompanies))
            .ForMember(dest => dest.DoctorInsuranceCompanies, opt => opt.MapFrom(src => src.DoctorMedicalInsuranceCompanies.Select(x => x.MedicalInsuranceCompany)))
        ;

        CreateMap<WorkSchedule, WorkScheduleDto>();
        CreateMap<WorkScheduleSettings, WorkScheduleSettingsDto>();

        CreateMap<UserMedicalLicense, UserMedicalLicenseDto>()
            .ForMember(dest => dest.SpecialtyId, opt => opt.MapFrom(src => src.MedicalLicense.MedicalLicenseSpecialty.SpecialtyId))
            .ForMember(dest => dest.SpecialtyName, opt => opt.MapFrom(src => src.MedicalLicense.MedicalLicenseSpecialty.Specialty.Name))
            .ForMember(dest => dest.Document, opt => opt.MapFrom(src => src.MedicalLicense.MedicalLicenseDocument.Document))
            .ForMember(dest => dest.SpecialtyLicense, opt => opt.MapFrom(src => src.MedicalLicense.SpecialtyLicense))
            .ForMember(dest => dest.LicenseNumber, opt => opt.MapFrom(src => src.MedicalLicense.LicenseNumber))
            .ForMember(dest => dest.IsMain, opt => opt.MapFrom(src => src.IsMain));

        CreateMap<Document, DocumentDto>();

        CreateMap<Google.Apis.Auth.GoogleJsonWebSignature.Payload, AppUser>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.GivenName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.FamilyName));

        CreateMap<AppUser, BillingDetailsDto>()
            .ForMember(dest => dest.UserAddresses, opt => opt.MapFrom(src => src.UserAddresses.Select(x => x.Address)))
            .ForMember(dest => dest.UserPaymentMethods, opt => opt.MapFrom(src => src.UserPaymentMethods.Select(x => x.PaymentMethod)));
        CreateMap<Address, UserAddressDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.UserAddress.Address.Id))
            .ForMember(dest => dest.IsMain, opt => opt.MapFrom(src => src.UserAddress.IsMain))
            .ForMember(dest => dest.IsBilling, opt => opt.MapFrom(src => src.UserAddress.IsBilling));
        CreateMap<PaymentMethod, UserPaymentMethodDto>()
            .ForMember(dest => dest.IsMain, opt => opt.MapFrom(src => src.UserPaymentMethod.IsMain));

        CreateMap<UserPaymentMethod, UserPaymentMethodDto>()
            .ForMember(dest => dest.Brand, opt => opt.MapFrom(src => src.PaymentMethod.Brand))
            .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.PaymentMethod.Country))
            .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.PaymentMethod.DisplayName))
            .ForMember(dest => dest.ExpirationMonth, opt => opt.MapFrom(src => src.PaymentMethod.ExpirationMonth))
            .ForMember(dest => dest.ExpirationYear, opt => opt.MapFrom(src => src.PaymentMethod.ExpirationYear))
            .ForMember(dest => dest.Last4, opt => opt.MapFrom(src => src.PaymentMethod.Last4))
            .ForMember(dest => dest.StripePaymentMethodId, opt => opt.MapFrom(src => src.PaymentMethod.StripePaymentMethodId))
            .ForMember(dest => dest.IsMain, opt => opt.MapFrom(src => src.IsMain));

        CreateMap<UserAddress, UserAddressDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Address.Id))
            .ForMember(dest => dest.IsMain, opt => opt.MapFrom(src => src.IsMain))
            .ForMember(dest => dest.IsBilling, opt => opt.MapFrom(src => src.IsBilling))
            .ForMember(dest => dest.Street, opt => opt.MapFrom(src => src.Address.Street))
            .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.Address.City))
            .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.Address.State))
            .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Address.Country))
            .ForMember(dest => dest.Zipcode, opt => opt.MapFrom(src => src.Address.Zipcode))
            .ForMember(dest => dest.Neighborhood, opt => opt.MapFrom(src => src.Address.Neighborhood))
            .ForMember(dest => dest.ExteriorNumber, opt => opt.MapFrom(src => src.Address.ExteriorNumber))
            .ForMember(dest => dest.InteriorNumber, opt => opt.MapFrom(src => src.Address.InteriorNumber));

        CreateMap<EventClinic, AddressDto>();
        CreateMap<EventService, ServiceDto>();

        CreateMap<DoctorEvent, DoctorDto>();
        CreateMap<PatientEvent, UserDto>();
        CreateMap<NurseEvent, NurseDto>();

        CreateMap<AppUser, UserSummaryDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.HasValue ? src.DateOfBirth.Value.CalculateAge() : 0))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.UserPhoto.Photo.Url));

        CreateMap<Event, EventDto>()
            .ForMember(dest => dest.Service, opt => opt.MapFrom(src => src.EventService.Service))
            .ForMember(dest => dest.Clinic, opt => opt.MapFrom(src => src.EventClinic.Clinic))
            .ForMember(dest => dest.Doctor, opt => opt.MapFrom(src => src.DoctorEvent.Doctor))
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.PatientEvent.Patient))
            .ForMember(dest => dest.Nurses, opt => opt.MapFrom(src => src.NurseEvents.Select(x => x.Nurse)))
            .ForMember(dest => dest.DateFrom, opt => opt.MapFrom(src => src.DateFrom))
            .ForMember(dest => dest.DateTo, opt => opt.MapFrom(src => src.DateTo))
            .ForMember(dest => dest.PaymentMethodType, opt => opt.MapFrom(src => src.EventPaymentMethodType.PaymentMethodType))
            .ForMember(dest => dest.MedicalInsuranceCompany, opt => opt.MapFrom(src => src.EventMedicalInsuranceCompany.MedicalInsuranceCompany))
            .ForMember(dest => dest.Payments, opt => opt.MapFrom(src => src.EventPayments.Select(x => x.Payment)))
            .ForMember(dest => dest.Prescriptions, opt => opt.MapFrom(src => src.EventPrescriptions.Select(x => x.Prescription)))
            .ForMember(dest => dest.PaymentStatus, opt => opt.MapFrom(src => src.EventPaymentStatus.PaymentStatus));

        CreateMap<PaymentStatus, PaymentStatusDto>();

        CreateMap<Prescription, EventPrescriptionDto>()
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.PatientPrescription.Patient))
            .ForMember(dest => dest.Doctor, opt => opt.MapFrom(src => src.DoctorPrescription.Doctor))
            .ForMember(dest => dest.Clinic, opt => opt.MapFrom(src => src.EventPrescription.Event.EventClinic.Clinic))
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.PrescriptionItems))
            .ForMember(dest => dest.LogoUrl, opt => opt.MapFrom(src => src.EventPrescription.Event.EventClinic.Clinic.ClinicLogo.Photo.Url));

        CreateMap<AppUser, EventDoctorFieldsDto>()
            .ForMember(dest => dest.Addresses, opt => opt.MapFrom(src => src.DoctorClinics));

        CreateMap<DoctorClinic, UserAddressDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Clinic.Id))
            .ForMember(dest => dest.IsMain, opt => opt.MapFrom(src => src.IsMain))
            .ForMember(dest => dest.Street, opt => opt.MapFrom(src => src.Clinic.Street))
            .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.Clinic.City))
            .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.Clinic.State))
            .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Clinic.Country))
            .ForMember(dest => dest.Zipcode, opt => opt.MapFrom(src => src.Clinic.Zipcode))
            .ForMember(dest => dest.Neighborhood, opt => opt.MapFrom(src => src.Clinic.Neighborhood))
            .ForMember(dest => dest.ExteriorNumber, opt => opt.MapFrom(src => src.Clinic.ExteriorNumber))
            .ForMember(dest => dest.InteriorNumber, opt => opt.MapFrom(src => src.Clinic.InteriorNumber));

        CreateMap<Event, EventSummaryDto>()
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.PatientEvent.Patient))
            .ForMember(dest => dest.DateFrom, opt => opt.MapFrom(src => src.DateFrom))
            .ForMember(dest => dest.DateTo, opt => opt.MapFrom(src => src.DateTo));

        CreateMap<Prescription, PrescriptionDto>()
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.PatientPrescription.Patient))
            .ForMember(dest => dest.Doctor, opt => opt.MapFrom(src => src.DoctorPrescription.Doctor))
            .ForMember(dest => dest.Event, opt => opt.MapFrom(src => src.EventPrescription.Event))
            .ForMember(dest => dest.Clinic, opt => opt.MapFrom(src => src.EventPrescription.Event.EventClinic.Clinic))
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.PrescriptionItems))
            .ForMember(dest => dest.LogoUrl, opt => opt.MapFrom(src => src.EventPrescription.Event.EventClinic.Clinic.ClinicLogo.Photo.Url))
            .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.PrescriptionOrder != null ? src.PrescriptionOrder.Order.Id : 0));

        CreateMap<PrescriptionUpdateDto, Prescription>()
            .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes));

        CreateMap<PrescriptionItem, PrescriptionItemDto>()
            .ForMember(dest => dest.Dosage, opt => opt.MapFrom(src => src.Dosage))
            .ForMember(dest => dest.Instructions, opt => opt.MapFrom(src => src.Instructions))
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

        CreateMap<DoctorPatient, DoctorDto>()
            .ForMember(dest => dest.Specialty, opt => opt.MapFrom(src => src.Doctor.UserMedicalLicenses.FirstOrDefault().MedicalLicense.MedicalLicenseSpecialty.Specialty.Name))
            .ForMember(dest => dest.AccessGranted, opt => opt.MapFrom(src => src.CreatedAt))
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.Doctor.FirstName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.Doctor.LastName))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.Doctor.UserPhoto.Photo.Url));

        CreateMap<AppUser, NurseDto>()
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.UserPhoto.Photo.Url))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.HasValue ? src.DateOfBirth.Value.CalculateAge() : 0))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth));

        CreateMap<AppUser, PatientDto>()
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.UserPhoto.Photo.Url))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
            .ForMember(dest => dest.HasAccount, opt => opt.MapFrom(src => src.Doctors.Count() > 0))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.HasValue ? src.DateOfBirth.Value.CalculateAge() : 0))
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
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.HasValue ? src.DateOfBirth.Value.CalculateAge() : 0))
            .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.UserRoles.Select(x => x.Role)))
            .ForMember(dest => dest.Permissions,
                opt => opt.MapFrom(src => src.UserPermissions.Select(x => x.Permission)))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.MedicalInsuranceCompanies, opt => opt.MapFrom(src => src.UserMedicalInsuranceCompanies))
            .ForMember(dest => dest.DoctorPayments, opt => opt.MapFrom(src => src.PatientEvents.SelectMany(x => x.Event.EventPayments.Select(y => y.Payment))))
            .ForMember(dest => dest.DoctorEvents, opt => opt.MapFrom(src => src.PatientEvents.Select(x => x.Event)))
            .ForMember(dest => dest.SharedDoctors, opt => opt.MapFrom(src => src.Doctors));

        CreateMap<DoctorPatient, DoctorPatientDto>();

        // Registration mapping
        CreateMap<RegisterDto, AppUser>()
            .ForMember(dest => dest.Sex, opt => opt.MapFrom(src => src.Gender));
        CreateMap<DoctorRegisterDto, AppUser>()
            .ForMember(dest => dest.Sex, opt => opt.MapFrom(src => src.Gender))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.Phone));

        CreateMap<AccountDetailsUpdateDto, AppUser>();

        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Unit))
            .ForMember(dest => dest.Dosage, opt => opt.MapFrom(src => src.Dosage))
            .ForMember(dest => dest.IsInternal, opt => opt.MapFrom(src => src.DoctorProduct == null))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.ProductPhotos.FirstOrDefault().Photo.Url));

        CreateMap<Product, ProductSummaryDto>()
            .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Unit))
            .ForMember(dest => dest.Dosage, opt => opt.MapFrom(src => src.Dosage))
            .ForMember(dest => dest.IsInternal, opt => opt.MapFrom(src => src.DoctorProduct == null))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.ProductPhotos.FirstOrDefault().Photo.Url))
        ;

        CreateMap<Product, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Options, opt => opt.MapFrom(src => new Options() {
                Description = src.Description,
                Id = src.Id,
                PhotoUrl = src.ProductPhotos.FirstOrDefault().Photo.Url,
                Price = src.Price,
                Dosage = src.Dosage,
                Unit = src.Unit,
            }))
        ;

        CreateMap<Service, ServiceDto>()
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.ServicePhotos.FirstOrDefault().Photo.Url));

        CreateMap<PaymentMethodType, PaymentMethodTypeDto>()

        ;
        
        CreateMap<PaymentMethodType, OptionDto>()

        ;
        
        CreateMap<Specialty, SpecialtyDto>()
        
        ;

        CreateMap<Specialty, OptionDto>()
        
        ;

        CreateMap<MedicalInsuranceCompany, MedicalInsuranceCompanyDto>()
            // .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.MedicalInsuranceCompanyPhoto.Photo.Url))
        ;
        CreateMap<UserMedicalInsuranceCompany, UserMedicalInsuranceCompanyDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.MedicalInsuranceCompanyId))
            .ForMember(dest => dest.Document, opt => opt.MapFrom(src => src.Document))
            .ForMember(dest => dest.MedicalInsuranceCompany, opt => opt.MapFrom(src => src.MedicalInsuranceCompany))
        ;

        CreateMap<Disease, DiseaseDto>();
        CreateMap<Substance, SubstanceDto>();
        CreateMap<ConsumptionLevel, ConsumptionLevelDto>();
        CreateMap<Occupation, OccupationDto>();
        CreateMap<MaritalStatus, MaritalStatusDto>();
        CreateMap<EducationLevel, EducationLevelDto>();
        CreateMap<ColorBlindness, ColorBlindnessDto>();
        CreateMap<RelativeType, RelativeTypeDto>();

        CreateMap<Disease, OptionDto>();
        CreateMap<Substance, OptionDto>();
        CreateMap<ConsumptionLevel, OptionDto>();
        CreateMap<Occupation, OptionDto>();
        CreateMap<MaritalStatus, OptionDto>();
        CreateMap<EducationLevel, OptionDto>();
        CreateMap<ColorBlindness, OptionDto>();
        CreateMap<RelativeType, OptionDto>();

        CreateMap<MedicalRecord, MedicalRecordDto>()
            .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.PatientName))
            .ForMember(dest => dest.Sex, opt => opt.MapFrom(src => src.GetSex()))
            .ForMember(dest => dest.HandDominance, opt => opt.MapFrom(src => src.GetHandDominance()))
            .ForMember(dest => dest.EducationLevel, opt => opt.MapFrom(src => src.MedicalRecordEducationLevel))
            .ForMember(dest => dest.Occupation, opt => opt.MapFrom(src => src.MedicalRecordOccupation.Occupation))
            .ForMember(dest => dest.ColorBlindness, opt => opt.MapFrom(src => src.MedicalRecordColorBlindness.ColorBlindness))
            .ForMember(dest => dest.MaritalStatus, opt => opt.MapFrom(src => src.MedicalRecordMaritalStatus.MaritalStatus))
            .ForMember(dest => dest.Companion, opt => opt.MapFrom(src => src.MedicalRecordCompanion))

            .ForMember(dest => dest.FamilyMembers, opt => opt.MapFrom(src => src.MedicalRecordFamilyMembers.Select(x => x.FamilyMember)))
            .ForMember(dest => dest.PersonalMedicalHistory, opt => opt.MapFrom(src => src.MedicalRecordPersonalDiseases.Select(x => x.Disease)))
            .ForMember(dest => dest.FamilyMedicalHistory, opt => opt.MapFrom(src => src.MedicalRecordFamilyDiseases))
            .ForMember(dest => dest.PersonalDrugHistory, opt => opt.MapFrom(src => src.MedicalRecordSubstances))
        ;

        CreateMap<EducationLevel, MedicalRecordEducationLevelDto>();
        CreateMap<Occupation, MedicalRecordOccupationDto>();
        CreateMap<MaritalStatus, MedicalRecordMaritalStatusDto>();
        CreateMap<ColorBlindness, MedicalRecordColorBlindnessDto>();

        CreateMap<MedicalRecordEducationLevel, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.EducationLevel.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.EducationLevel.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.EducationLevel.Code))
        ;

        CreateMap<MedicalRecordOccupation, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Occupation.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Occupation.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Occupation.Code))
        ;

        CreateMap<MedicalRecordMaritalStatus, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.MaritalStatus.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.MaritalStatus.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.MaritalStatus.Code))
        ;

        CreateMap<MedicalRecordColorBlindness, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ColorBlindness.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.ColorBlindness.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.ColorBlindness.Code))
        ;

        CreateMap<FamilyMember, MedicalRecordFamilyMemberDto>()
            .ForMember(dest => dest.RelativeType, opt => opt.MapFrom(src => src.MedicalRecordFamilyMemberRelativeType))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.Age))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
        ;

        CreateMap<MedicalRecordFamilyMemberRelativeType, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.RelativeType.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.RelativeType.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.RelativeType.Code))
        ;

        CreateMap<Disease, MedicalRecordPersonalDiseaseDto>()
            .ForMember(dest => dest.Disease, opt => opt.MapFrom(src => src))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
        ;

        CreateMap<MedicalRecordFamilyMember, MedicalRecordFamilyMemberDto>()
            .ForMember(dest => dest.RelativeType, opt => opt.MapFrom(src => src.FamilyMember.MedicalRecordFamilyMemberRelativeType.RelativeType))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.FamilyMember.Name))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.FamilyMember.Age))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.FamilyMember.Id))
        ;

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
            .ForMember(dest => dest.Occupation, opt => opt.MapFrom(src => src.Companion.CompanionOccupation))
        ;

        CreateMap<CompanionRelativeType, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.RelativeType.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.RelativeType.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.RelativeType.Code))
        ;

        CreateMap<CompanionOccupation, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Occupation.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Occupation.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Occupation.Code))
        ;
        
        CreateMap<MedicalRecordPersonalDisease, MedicalRecordPersonalDiseaseDto>()
            .ForMember(dest => dest.Disease, opt => opt.MapFrom(src => src.Disease))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.DiseaseId))
        ;

        CreateMap<MedicalRecordFamilyDisease, MedicalRecordFamilyDiseaseDto>()
            .ForMember(dest => dest.RelativeType, opt => opt.MapFrom(src => src.RelativeType))
            .ForMember(dest => dest.Disease, opt => opt.MapFrom(src => src.Disease))
            // .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            
        ;
        CreateMap<MedicalRecordSubstance, MedicalRecordSubstanceDto>();

        CreateMap<Service, OptionDto>()
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Options, opt => opt.MapFrom(src => new Options { Price = src.Price }))
        ;

        CreateMap<Address, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => $"{src.Street}, {src.City}, {src.State}, {src.Country}"))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Id.ToString()))
            .ForMember(dest => dest.Options, opt => opt.MapFrom(src => new Options { 
                PhotoUrl = src.ClinicLogo.Photo.Url
            }))
        ;

        CreateMap<MedicalInsuranceCompany, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Id.ToString()))
            .ForMember(dest => dest.Options, opt => opt.MapFrom(src => new Options() { PhotoUrl = src.GetPhotoUrl(), }))
        ;
    }
}