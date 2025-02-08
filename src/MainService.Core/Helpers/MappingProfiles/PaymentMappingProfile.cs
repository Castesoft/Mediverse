using AutoMapper;
using MainService.Core.DTOs.User;
using MainService.Models.Entities;

namespace MainService.Core.Helpers.MappingProfiles;

public class PaymentMappingProfile : Profile
{
    public PaymentMappingProfile()
    {
        CreateMap<Payment, PaymentDto>()
            .ForMember(dest => dest.PaymentStatus, opt => opt.MapFrom(src => src.PaymentStatus.ToString()))
            .ReverseMap()
            .ForMember(dest => dest.PaymentStatus, opt => opt.Ignore());
    }
}