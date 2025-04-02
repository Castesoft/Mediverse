using AutoMapper;
using MainService.Core.DTOs.Payment;
using MainService.Models.Entities;

namespace MainService.Core.Helpers.MappingProfiles;

public class PaymentMappingProfile : Profile
{
    public PaymentMappingProfile()
    {
        CreateMap<Payment, PaymentDto>()
            .ForMember(dest => dest.PaymentStatus, opt => opt.MapFrom(src => src.PaymentStatus.ToString()))
            .ForMember(dest => dest.PaymentMethodType, opt => opt.MapFrom(src =>
                src.Event != null ? src.Event.EventPaymentMethodType.PaymentMethodType : null))
            .ForMember(dest => dest.PaymentMethod, opt => opt.MapFrom(src => src.PaymentMethod))
            .ForMember(dest => dest.EventId, opt => opt.MapFrom(src => src.EventId))
            .ForMember(dest => dest.Event, opt => opt.MapFrom(src => src.Event));

        CreateMap<PaymentDto, Payment>()
            .ForMember(dest => dest.PaymentStatus, opt => opt.Ignore());
    }
}