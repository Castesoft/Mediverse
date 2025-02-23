using AutoMapper;
using MainService.Core.DTOs.Orders;
using MainService.Models.Entities;

namespace MainService.Core.Helpers.Resolvers;

/// <summary>
/// Resolves the photo URL for an order product.
/// </summary>
public class OrderProductPhotoUrlResolver : IValueResolver<OrderProduct, OrderItemDto, string?>
{
    public string? Resolve(OrderProduct source, OrderItemDto destination, string? destMember, ResolutionContext context)
    {
        if (source.Product == null || source.Product.ProductPhotos == null || !source.Product.ProductPhotos.Any())
        {
            Console.Error.WriteLine("Product or ProductPhotos is null or empty.");
            return null;
        }

        // Try to get the main photo first.
        var mainPhoto =
            source.Product.ProductPhotos.FirstOrDefault(pp =>
                pp.IsMain &&
                pp.Photo != null &&
                pp.Photo.Url != null);
        if (mainPhoto != null)
        {
            return mainPhoto.Photo.Url.AbsoluteUri;
        }

        // Otherwise return the first available photo URL.
        var firstPhoto = source.Product.ProductPhotos.FirstOrDefault(pp =>
            pp.Photo != null &&
            pp.Photo.Url != null);
        return firstPhoto != null ? firstPhoto.Photo.Url.AbsoluteUri : null;
    }
}