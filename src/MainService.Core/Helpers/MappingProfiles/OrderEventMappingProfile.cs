using AutoMapper;
using MainService.Core.DTOs.Events;
using MainService.Core.DTOs.Orders;
using MainService.Core.DTOs.Prescription;
using MainService.Core.DTOs.User;
using MainService.Core.Helpers.Resolvers;
using MainService.Models.Entities;

namespace MainService.Core.Helpers.MappingProfiles;

public class OrderEventMappingProfile : Profile
{
    public OrderEventMappingProfile()
    {
        // Map Order to OrderDto.
        CreateMap<Order, OrderDto>()
            .ForMember(dest => dest.DeliveryAddress, opt => opt.MapFrom(src =>
                src.OrderDeliveryAddress != null ? src.OrderDeliveryAddress.DeliveryAddress : null))
            //.ForMember(dest => dest.PickupAddress, opt => opt.MapFrom(src => src.OrderPickupAddress != null ? src.OrderPickupAddress.PickupAddress : null))
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.PatientOrder.Patient))
            .ForMember(dest => dest.Doctor, opt => opt.MapFrom(src => src.DoctorOrder.Doctor))
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.OrderItems))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.OrderOrderStatus.OrderStatus))
            .ForMember(dest => dest.DeliveryStatus,
                opt => opt.MapFrom(src => src.OrderDeliveryStatus.DeliveryStatus));

        // Map OrderItem to OrderItemDto.
        CreateMap<OrderProduct, OrderItemDto>()
            .ForMember(dest => dest.Dosage, opt => opt.MapFrom(src => src.Dosage))
            .ForMember(dest => dest.Instructions, opt => opt.MapFrom(src => src.Instructions))
            .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes))
            .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
            .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Product.Unit))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Product.Name))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Product.Description))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product.Price))
            .ForMember(dest => dest.Discount, opt => opt.MapFrom(src => src.Product.Discount))
            .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom(src => src.Product.Manufacturer))
            .ForMember(dest => dest.LotNumber, opt => opt.MapFrom(src => src.Product.LotNumber));

        // Map OrderItem to PrescriptionItemDto.
        CreateMap<OrderProduct, PrescriptionItemDto>()
            .ForMember(dest => dest.Dosage, opt => opt.MapFrom(src => src.Dosage))
            .ForMember(dest => dest.Instructions, opt => opt.MapFrom(src => src.Instructions))
            .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes))
            .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
            .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Product.Unit))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Product.Name))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Product.Description))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product.Price))
            .ForMember(dest => dest.Discount, opt => opt.MapFrom(src => src.Product.Discount))
            .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom(src => src.Product.Manufacturer))
            .ForMember(dest => dest.LotNumber, opt => opt.MapFrom(src => src.Product.LotNumber));

        // Map Prescription to EventPrescriptionDto.
        CreateMap<Prescription, EventPrescriptionDto>()
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.PatientPrescription.Patient))
            .ForMember(dest => dest.Doctor, opt => opt.MapFrom(src => src.DoctorPrescription.Doctor))
            .ForMember(dest => dest.Clinic,
                opt => opt.MapFrom(src => src.EventPrescription.Event.EventClinic.Clinic))
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.PrescriptionItems))
            // Use the custom resolver for LogoUrl.
            .ForMember(dest => dest.LogoUrl, opt => opt.MapFrom(src => src.GetPhotoUrl()));

        CreateMap<Prescription, PrescriptionDto>()
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.PatientPrescription.Patient))
            .ForMember(dest => dest.Doctor, opt => opt.MapFrom(src => src.DoctorPrescription.Doctor))
            .ForMember(dest => dest.Event, opt => opt.MapFrom(src => src.EventPrescription.Event))
            .ForMember(dest => dest.Clinic, opt => opt.MapFrom(src => src.PrescriptionClinic.Clinic))
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.PrescriptionItems.Select(x => x.Product)))
            .ForMember(dest => dest.LogoUrl, opt => opt.MapFrom(src => src.GetPhotoUrl()))
            .ForMember(dest => dest.OrderId,
                opt => opt.MapFrom(src => src.PrescriptionOrder != null ? src.PrescriptionOrder.Order.Id : 0));

        // Map PrescriptionUpdateDto to Prescription.
        CreateMap<PrescriptionUpdateDto, Prescription>()
            .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes));

        // Map PrescriptionItem to PrescriptionItemDto.
        CreateMap<PrescriptionProduct, PrescriptionItemDto>()
            .ForMember(dest => dest.Dosage, opt => opt.MapFrom(src => src.Dosage))
            .ForMember(dest => dest.Instructions, opt => opt.MapFrom(src => src.Instructions))
            .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
            .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Product.Unit))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Product.Name))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Product.Description))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product.Price))
            .ForMember(dest => dest.Discount, opt => opt.MapFrom(src => src.Product.Discount))
            .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom(src => src.Product.Manufacturer))
            .ForMember(dest => dest.LotNumber, opt => opt.MapFrom(src => src.Product.LotNumber))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.Product.CreatedAt));

        // Map Event to EventDto.
        CreateMap<Event, EventDto>()
            .ForMember(dest => dest.Service, opt => opt.MapFrom(src => src.EventService.Service))
            .ForMember(dest => dest.Clinic, opt => opt.MapFrom(src => src.EventClinic.Clinic))
            .ForMember(dest => dest.Doctor, opt => opt.MapFrom(src => src.DoctorEvent.Doctor))
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.PatientEvent.Patient))
            .ForMember(dest => dest.Nurses, opt => opt.MapFrom(src => src.NurseEvents.Select(x => x.Nurse)))
            .ForMember(dest => dest.DateFrom, opt => opt.MapFrom(src => src.DateFrom))
            .ForMember(dest => dest.DateTo, opt => opt.MapFrom(src => src.DateTo))
            .ForMember(dest => dest.PaymentMethodType,
                opt => opt.MapFrom(src => src.EventPaymentMethodType.PaymentMethodType))
            .ForMember(dest => dest.MedicalInsuranceCompany,
                opt => opt.MapFrom(src => src.EventMedicalInsuranceCompany.MedicalInsuranceCompany))
            .ForMember(dest => dest.Prescriptions,
                opt => opt.MapFrom(src => src.EventPrescriptions.Select(x => x.Prescription)));

        // Map Event to EventSummaryDto.
        CreateMap<Event, EventSummaryDto>()
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.PatientEvent.Patient))
            .ForMember(dest => dest.Doctor, opt => opt.MapFrom(src => src.DoctorEvent.Doctor))
            .ForMember(dest => dest.DateFrom, opt => opt.MapFrom(src => src.DateFrom))
            .ForMember(dest => dest.DateTo, opt => opt.MapFrom(src => src.DateTo));

        // Map DoctorEvent to EventDto.
        CreateMap<DoctorEvent, EventDto>();

        CreateMap<PaymentMethod, UserPaymentMethodDto>()
            .ForMember(dest => dest.Brand, opt => opt.MapFrom(src => src.Brand))
            .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Country))
            .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.DisplayName))
            .ForMember(dest => dest.ExpirationMonth, opt => opt.MapFrom(src => src.ExpirationMonth))
            .ForMember(dest => dest.ExpirationYear, opt => opt.MapFrom(src => src.ExpirationYear))
            .ForMember(dest => dest.Last4, opt => opt.MapFrom(src => src.Last4))
            .ForMember(dest => dest.StripePaymentMethodId, opt => opt.MapFrom(src => src.StripePaymentMethodId))
            .ForMember(dest => dest.IsDefault, opt => opt.MapFrom(src => src.IsDefault))
            .ForMember(dest => dest.Funding, opt => opt.MapFrom(src => src.Funding));

        CreateMap<PaymentStatus, PaymentStatusDto>();
    }
}