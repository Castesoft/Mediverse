using AutoMapper;
using MainService.Models.Entities;

namespace MainService.Core.Helpers.Resolvers;

/// <summary>
/// Resolver to extract the clinic logo URL from an Address’s ClinicLogo property.
/// </summary>
public class ClinicLogoUrlResolver : IValueResolver<Address, object, string?>
{
    public string? Resolve(Address source, object destination, string destMember, ResolutionContext context)
    {
        if (source == null)
        {
            Console.WriteLine("ClinicLogoUrlResolver: source is null");
            return null;
        }
        
        if (source.ClinicLogo == null)
        {
            Console.WriteLine("ClinicLogoUrlResolver: source.ClinicLogo is null");
            return null;
        }
        
        if (source.ClinicLogo.Photo == null)
        {
            Console.WriteLine("ClinicLogoUrlResolver: source.ClinicLogo.Photo is null");
            return null;
        }

        if (source.ClinicLogo != null &&
            source.ClinicLogo.Photo != null &&
            source.ClinicLogo.Photo.Url != null)
        {
            return source.ClinicLogo.Photo.Url.AbsoluteUri;
        }

        return null;
    }
}