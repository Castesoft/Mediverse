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
        // Map Payment to PaymentDto.
        CreateMap<Payment, PaymentDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Amount, opt => opt.MapFrom(src => src.Amount))
            .ForMember(dest => dest.PaymentDate, opt => opt.MapFrom(src => src.CreatedAt))
            .ForMember(dest => dest.PaymentMethod,
                opt => opt.MapFrom(src => src.PaymentPaymentMethod.PaymentMethod))
            .ForMember(dest => dest.PaymentMethodType,
                opt => opt.MapFrom(src => src.PaymentPaymentMethodType.PaymentMethodType))
            .ForMember(dest => dest.DoctorId, opt => opt.MapFrom(src =>
                (src.EventPayment != null && src.EventPayment.Event != null &&
                 src.EventPayment.Event.DoctorEvent != null && src.EventPayment.Event.DoctorEvent.Doctor != null)
                    ? src.EventPayment.Event.DoctorEvent.Doctor.Id
                    : 0));

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

        // Map OrderItem to PrescriptionItemDto.
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
            .ForMember(dest => dest.Clinic, opt => opt.MapFrom(src => src.EventPrescription.Event.EventClinic.Clinic))
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.PrescriptionItems))
            .ForMember(dest => dest.LogoUrl, opt => opt.MapFrom(src => src.GetPhotoUrl()))
            .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.PrescriptionOrder != null ? src.PrescriptionOrder.Order.Id : 0));

        // Map PrescriptionUpdateDto to Prescription.
        CreateMap<PrescriptionUpdateDto, Prescription>()
            .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes));

        // Map PrescriptionItem to PrescriptionItemDto.
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
            .ForMember(dest => dest.Payments, opt => opt.MapFrom(src => src.EventPayments.Select(x => x.Payment)))
            .ForMember(dest => dest.Prescriptions,
                opt => opt.MapFrom(src => src.EventPrescriptions.Select(x => x.Prescription)))
            .ForMember(dest => dest.PaymentStatus, opt => opt.MapFrom(src => src.EventPaymentStatus.PaymentStatus));

        // Map Event to EventSummaryDto.
        CreateMap<Event, EventSummaryDto>()
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.PatientEvent.Patient))
            .ForMember(dest => dest.DateFrom, opt => opt.MapFrom(src => src.DateFrom))
            .ForMember(dest => dest.DateTo, opt => opt.MapFrom(src => src.DateTo));

        // Map DoctorEvent to EventDto.
        CreateMap<DoctorEvent, EventDto>();

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

        CreateMap<PaymentStatus, PaymentStatusDto>();
    }
}