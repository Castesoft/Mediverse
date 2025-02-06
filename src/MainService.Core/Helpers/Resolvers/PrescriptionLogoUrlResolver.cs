using AutoMapper;
using MainService.Models.Entities;
using MainService.Core.DTOs.Prescription;

namespace MainService.Core.Helpers.Resolvers;

/// <summary>
/// Resolves the LogoUrl for a Prescription by navigating its nested EventPrescription chain.
/// Returns the AbsoluteUri if found; otherwise returns null.
/// </summary>
public class PrescriptionLogoUrlResolver : IValueResolver<Prescription?, EventPrescriptionDto, string?>
{
    public string? Resolve(Prescription? source, EventPrescriptionDto destination, string destMember,
        ResolutionContext context)
    {
        // Explicit null-checks instead of using null-conditional operators.
        if (source == null)
            return null;

        if (source.EventPrescription == null)
            return null;

        var evt = source.EventPrescription.Event;
        if (evt == null)
            return null;

        var eventClinic = evt.EventClinic;
        if (eventClinic == null)
            return null;

        var clinic = eventClinic.Clinic;
        if (clinic == null)
            return null;

        var clinicLogo = clinic.ClinicLogo;
        if (clinicLogo == null)
            return null;

        var photo = clinicLogo.Photo;
        if (photo == null)
            return null;

        var url = photo.Url;
        return url != null ? url.AbsoluteUri : null;
    }
}