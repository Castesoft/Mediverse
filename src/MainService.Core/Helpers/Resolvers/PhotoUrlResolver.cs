using AutoMapper;
using MainService.Models.Entities;

namespace MainService.Core.Helpers;

/// <summary>
/// Custom resolver to retrieve the photo URL from an AppUser.
/// Uses explicit null checks rather than the null‐conditional operator.
/// </summary>
public class PhotoUrlResolver : IValueResolver<AppUser?, object, string?>
{
    public string? Resolve(AppUser? source, object destination, string destMember, ResolutionContext context)
    {
        if (source == null) return null;
        
        if (source.UserPhoto != null && source.UserPhoto.Photo != null && source.UserPhoto.Photo.Url != null)
            return source.UserPhoto.Photo.Url.AbsoluteUri;
        
        return null;
    }
}