using AutoMapper;
using MainService.Core.DTOs.Subscriptions;
using MainService.Models.Entities;

namespace MainService.Core.Helpers.MappingProfiles;

public class SubscriptionHistoryMappingProfile : Profile
{
    public SubscriptionHistoryMappingProfile()
    {
        CreateMap<SubscriptionHistory, SubscriptionHistoryDto>()
            .ForMember(dest => dest.OldStatus, opt => opt.MapFrom(src => src.OldStatus.ToString()))
            .ForMember(dest => dest.NewStatus, opt => opt.MapFrom(src => src.NewStatus.ToString()))
            .ReverseMap()
            .ForMember(dest => dest.OldStatus, opt => opt.Ignore())
            .ForMember(dest => dest.NewStatus, opt => opt.Ignore());
    }
}