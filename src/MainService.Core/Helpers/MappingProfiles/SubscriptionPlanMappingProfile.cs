using AutoMapper;
using MainService.Core.DTOs.Subscriptions;
using MainService.Models.Entities;

namespace MainService.Core.Helpers.MappingProfiles;

public class SubscriptionPlanMappingProfile : Profile
{
    public SubscriptionPlanMappingProfile()
    {
        CreateMap<SubscriptionPlan, SubscriptionPlanDto>().ReverseMap();
        CreateMap<SubscriptionPlan, SubscriptionPlanCreateDto>().ReverseMap();
        CreateMap<SubscriptionPlan, SubscriptionPlanUpdateDto>().ReverseMap();
    }
}