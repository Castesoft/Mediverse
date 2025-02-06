using AutoMapper;
using MainService.Models.Entities;

namespace MainService.Core.Helpers.Resolvers;

/// <summary>
/// Resolver to extract the banner URL from an AppUser’s DoctorBannerPhoto property.
/// Uses explicit null checks.
/// </summary>
public class BannerUrlResolver : IValueResolver<AppUser?, object, string?>
{
    public string? Resolve(AppUser? source, object destination, string destMember, ResolutionContext context)
    {
        if (source == null)
            return null;

        if (source.DoctorBannerPhoto != null &&
            source.DoctorBannerPhoto.Photo != null &&
            source.DoctorBannerPhoto.Photo.Url != null)
        {
            return source.DoctorBannerPhoto.Photo.Url.AbsoluteUri;
        }

        return null;
    }
}