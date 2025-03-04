using AutoMapper;
using MainService.Core.DTOs.Subscriptions;
using MainService.Models.Entities;

namespace MainService.Core.Helpers.MappingProfiles;

public class SubscriptionMappingProfile : Profile
{
    public SubscriptionMappingProfile()
    {
        CreateMap<UserSubscription, SubscriptionDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.StripePlanId, opt => opt.MapFrom(src => src.SubscriptionPlan.StripePlanId))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.SubscriptionPlan.Price))
            .ForMember(dest => dest.PlanName, opt => opt.MapFrom(src => src.SubscriptionPlan.Name))
            .ForMember(dest => dest.PlanId, opt => opt.MapFrom(src => src.SubscriptionPlan.Id));

        CreateMap<SubscriptionDto, UserSubscription>()
            .ForMember(dest => dest.Status, opt => opt.Ignore());
    }
}