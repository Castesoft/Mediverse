using Google.Apis.Auth;
using MainService.Core.DTOs.Google;

namespace MainService.Core.Interfaces.Services
{
    public interface IGoogleService
    {
        Task<GoogleJsonWebSignature.Payload> VerifyGoogleTokenAsync(string token);
        Task<(double? latitude, double? longitude)> GetAddressCoordinatesAsync(string address);
        Task<GooglePlacesDetailsResult> GetLocationByPlaceIdAsync(string placeId);
    }
}