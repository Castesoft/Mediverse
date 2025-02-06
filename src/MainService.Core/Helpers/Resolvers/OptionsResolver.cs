using AutoMapper;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate; // Assuming Options is in this namespace

namespace MainService.Core.Helpers.Resolvers;

/// <summary>
/// Resolver to construct an Options object from an Address.
/// Currently, it sets PhotoUrl based on the clinic logo.
/// </summary>
public class OptionsResolver : IValueResolver<Address, OptionDto, Options>
{
    public Options Resolve(Address source, OptionDto destination, Options destMember, ResolutionContext context)
    {
        // Create and return a new Options instance.
        return new Options
        {
            PhotoUrl = (source.ClinicLogo != null &&
                        source.ClinicLogo.Photo != null &&
                        source.ClinicLogo.Photo.Url != null)
                ? source.ClinicLogo.Photo.Url.AbsoluteUri
                : null
        };
    }
}