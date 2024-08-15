using Google.Apis.Auth;

namespace MainService.Core.Interfaces.Services
{
    public interface IGoogleService
    {
        Task<GoogleJsonWebSignature.Payload> VerifyGoogleTokenAsync(string token);
        Task<(double? latitude, double? longitude)> GetAddressCoordinatesAsync(string address);
    }
}