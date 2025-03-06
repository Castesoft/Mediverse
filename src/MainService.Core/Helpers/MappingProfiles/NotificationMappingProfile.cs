using AutoMapper;
using MainService.Core.DTOs.Notification;
using MainService.Models.Entities;

namespace MainService.Core.Helpers.MappingProfiles;

public class NotificationMappingProfile : Profile
{
    public NotificationMappingProfile()
    {
        CreateMap<UserNotification, NotificationDto>()
            .ForMember(dest=>dest.Id, opt=>opt.MapFrom(src=>src.NotificationId))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Notification.Title))
            .ForMember(dest => dest.Message, opt => opt.MapFrom(src => src.Notification.Message))
            .ForMember(dest => dest.ActionUrl, opt => opt.MapFrom(src => src.Notification.ActionUrl))
            .ForMember(dest => dest.NotificationType, opt => opt.MapFrom(src => src.Notification.NotificationType))
            .ForMember(dest => dest.Payload, opt => opt.MapFrom(src => src.Notification.Payload))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.Notification.CreatedAt));
    }
}