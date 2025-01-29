using System.Text.Json;
using MainService.Models.Entities.Aggregate;
using Microsoft.AspNetCore.Http;

namespace MainService.Core.DTOs.User
{
    public class AccountDetailsUpdateDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? LicenseNumber { get; set; }
        public string? SpecialtyLicense { get; set; }
        public string? Specialty { get; set; }

        public OptionDto? GetSpecialty() =>
            Specialty != null
                ? JsonSerializer.Deserialize<OptionDto>(Specialty,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                : null;

        // public int SubSpecialtyId { get; set; }
        public string? AcceptedPaymentMethods { get; set; }
        public bool? RequireAnticipatedCardPayments { get; set; }
        public bool RemoveAvatar { get; set; } = false;
        public IFormFile? Photo { get; set; }
        public IFormFile? File { get; set; }
    }
}