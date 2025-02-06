using AutoMapper;
using MainService.Models.Entities;

namespace MainService.Core.Helpers.Resolvers;

/// <summary>
/// Resolves the photo URL for a service.
/// Returns the AbsoluteUri of the first available service photo or null.
/// </summary>
public class ServicePhotoUrlResolver : IValueResolver<Service?, object, string?>
{
    public string? Resolve(Service? source, object destination, string destMember, ResolutionContext context)
    {
        if (source == null || source.ServicePhotos == null || !source.ServicePhotos.Any())
        {
            return null;
        }

        var photo = source.ServicePhotos.FirstOrDefault(sp =>
            sp.Photo != null &&
            sp.Photo.Url != null);
        return photo != null ? photo.Photo.Url.AbsoluteUri : null;
    }
}