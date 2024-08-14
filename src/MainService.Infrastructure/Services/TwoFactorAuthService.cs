using System.Text;
using System.Text.Encodings.Web;
using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace MainService.Infrastructure.Services
{
    public class TwoFactorAuthService(UserManager<AppUser> userManager) : ITwoFactorAuthService
    {
        public async Task<(string, string)> GenerateTwoFactorTokenAsync(AppUser user)
        {
            var unformattedKey = await userManager.GetAuthenticatorKeyAsync(user);
            if (string.IsNullOrWhiteSpace(unformattedKey))
            {
                await userManager.ResetAuthenticatorKeyAsync(user);
                unformattedKey = await userManager.GetAuthenticatorKeyAsync(user);
            }

            var sharedKey = FormatKey(unformattedKey);
            var authenticatorUri = GenerateQrCodeUri(user.Email, unformattedKey);

            return (sharedKey, authenticatorUri);
        }

        private static string FormatKey(string unformattedKey)
        {
            var result = new StringBuilder();
            int currentPosition = 0;
            while (currentPosition + 4 < unformattedKey.Length)
            {
                result.Append(unformattedKey.AsSpan(currentPosition, 4)).Append(' ');
                currentPosition += 4;
            }
            if (currentPosition < unformattedKey.Length)
            {
                result.Append(unformattedKey.AsSpan(currentPosition));
            }
            return result.ToString().ToLowerInvariant();
        }

        private static string GenerateQrCodeUri(string email, string unformattedKey)
        {
            return string.Format(
                "otpauth://totp/{0}?secret={1}&issuer={2}&digits=6",
                UrlEncoder.Default.Encode(email),
                unformattedKey,
                UrlEncoder.Default.Encode("Mediverse"));
        }
    }
}