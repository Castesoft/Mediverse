using Google.Apis.Auth;
using MainService.Core.Interfaces.Services;
using MainService.Core.Settings;
using Microsoft.Extensions.Options;

namespace MainService.Infrastructure.Services
{
    public class GoogleService : IGoogleService
    {
        private readonly GoogleSettings _googleSettings;
        public GoogleService(IOptions<GoogleSettings> googleSettings)
        {
            _googleSettings = googleSettings.Value;
        }

        public async Task<GoogleJsonWebSignature.Payload> VerifyGoogleTokenAsync(string token)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = [_googleSettings.ClientId]
                };
                var payload = await GoogleJsonWebSignature.ValidateAsync(token, settings);
                return payload;
            }
            catch (Exception)
            {
                //log an exception
                return null;
            }
        }
    }
}