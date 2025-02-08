using AutoMapper;
using MainService.Core.DTOs.Subscriptions;
using MainService.Models.Entities;

namespace MainService.Core.Helpers.MappingProfiles;

public class SubscriptionMappingProfile : Profile
{
    public SubscriptionMappingProfile()
    {
        CreateMap<Subscription, SubscriptionDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ReverseMap()
            .ForMember(dest => dest.Status, opt => opt.Ignore());
    }
}