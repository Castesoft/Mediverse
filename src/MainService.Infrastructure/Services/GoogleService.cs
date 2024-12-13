using Google.Apis.Auth;
using MainService.Core.DTOs.Google;
using MainService.Core.Interfaces.Services;
using MainService.Core.Settings;
using MainService.Models.Entities;
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
            string url = $"https://maps.googleapis.com/maps/api/place/textsearch/json?query={address}&key={_googleSettings.ApiKey}";
            HttpResponseMessage response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                string json = await response.Content.ReadAsStringAsync();

                GooglePlacesTextSearchResponse? result = JsonConvert.DeserializeObject<GooglePlacesTextSearchResponse>(json);

                if (
                    result != null && 
                    !string.IsNullOrEmpty(result.Status) && 
                    result.Status == "OK" && 
                    result.Results.Count() > 0
                )
                {
                    Geometry? geometry = result.Results.First().Geometry;

                    if (geometry != null) {
                        Location? location = geometry.Location;

                        if (location != null) {
                            return (location.Lat, location.Lng);
                        }
                    }
                }
            }

            return (null, null);
        }

        public string GetAddressText(Address item) => $"{item.Street} {item.ExteriorNumber}, {item.Neighborhood}, {item.City}, {item.State}, {item.Zipcode}";

        public async Task<GooglePlacesDetailsResult?> GetLocationByPlaceIdAsync(string placeId)
        {
            var url = $"https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&key={_googleSettings.ApiKey}";
            var response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                string? json = await response.Content.ReadAsStringAsync();
                GooglePlacesDetailsResponse? result = JsonConvert.DeserializeObject<GooglePlacesDetailsResponse>(json);

                if (result != null && !string.IsNullOrEmpty(result.Status) && result.Status == "OK")
                {
                    return result.Result;
                }
            }

            return null!;
        }

        public async Task<GoogleJsonWebSignature.Payload?> VerifyGoogleTokenAsync(string token)
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