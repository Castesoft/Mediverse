using Google.Apis.Auth;
using MainService.Core.DTOs.Google;
using MainService.Core.Interfaces.Services;
using MainService.Core.Settings;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace MainService.Infrastructure.Services
{
    public class GoogleService : IGoogleService
    {
        private readonly GoogleSettings _googleSettings;
        private readonly HttpClient _httpClient;
        public GoogleService(IOptions<GoogleSettings> googleSettings, HttpClient httpClient)
        {
            _googleSettings = googleSettings.Value;
            _httpClient = httpClient;
        }

        public async Task<(double? latitude, double? longitude)> GetAddressCoordinatesAsync(string address)
        {
            var url = $"https://maps.googleapis.com/maps/api/place/textsearch/json?query={address}&key={_googleSettings.ApiKey}";
            var response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeObject<GooglePlacesTextSearchResponse>(json);

                if (result?.Status == "OK" && result.Results.Count > 0)
                {
                    var location = result.Results[0].Geometry.Location;
                    return (location.Lat, location.Lng);
                }
            }

            return (null, null);
        }

        public async Task<GooglePlacesDetailsResult> GetLocationByPlaceIdAsync(string placeId)
        {
            var url = $"https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&key={_googleSettings.ApiKey}";
            var response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeObject<GooglePlacesDetailsResponse>(json);

                if (result.Status == "OK")
                {
                    return result.Result;
                }
            }

            return null;
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