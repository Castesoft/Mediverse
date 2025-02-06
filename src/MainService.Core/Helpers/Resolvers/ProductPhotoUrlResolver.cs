using AutoMapper;
using MainService.Models.Entities;

namespace MainService.Core.Helpers.Resolvers;

/// <summary>
/// Resolves the photo URL for a product.
/// Returns the AbsoluteUri of the first product photo marked as IsMain if available;
/// otherwise the first available photo’s URL or null.
/// </summary>
public class ProductPhotoUrlResolver : IValueResolver<Product?, object, string?>
{
    public string? Resolve(Product? source, object destination, string destMember, ResolutionContext context)
    {
        if (source == null || source.ProductPhotos == null || !source.ProductPhotos.Any())
        {
            return null;
        }

        // Try to get the main photo first.
        var mainPhoto = source.ProductPhotos.FirstOrDefault(pp =>
            pp.IsMain &&
            pp.Photo != null &&
            pp.Photo.Url != null);
        if (mainPhoto != null)
        {
            return mainPhoto.Photo.Url.AbsoluteUri;
        }

        // Otherwise return the first available photo URL.
        var firstPhoto = source.ProductPhotos.FirstOrDefault(pp =>
            pp.Photo != null &&
            pp.Photo.Url != null);
        return firstPhoto != null ? firstPhoto.Photo.Url.AbsoluteUri : null;
    }
}