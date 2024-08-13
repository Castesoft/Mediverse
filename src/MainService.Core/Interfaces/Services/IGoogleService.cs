using Google.Apis.Auth;

namespace MainService.Core.Interfaces.Services
{
    public interface IGoogleService
    {
        Task<GoogleJsonWebSignature.Payload> VerifyGoogleTokenAsync(string token);
    }
}