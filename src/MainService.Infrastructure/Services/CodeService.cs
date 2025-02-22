using System.Security.Cryptography;
using System.Text;
using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;

namespace MainService.Infrastructure.Services;

public class CodeService : ICodeService
{
    public string GenerateEmailCode()
    {
        var random = new Random();
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return new string(Enumerable.Repeat(chars, 6).Select(s => s[random.Next(s.Length)]).ToArray());
    }

    public string GeneratePhoneNumberCode()
    {
        var random = new Random();
        const string chars = "0123456789";
        return new string(Enumerable.Repeat(chars, 6).Select(s => s[random.Next(s.Length)]).ToArray());
    }

    public bool ValidateEmailCode(AppUser user, string code)
    {
        if (user.EmailVerificationExpiryTime < DateTime.UtcNow) return false;

        if (user.EmailVerificationCodeSalt == null) return false;

        using var hmac = new HMACSHA512(user.EmailVerificationCodeSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(code));

        if (user.EmailVerificationCodeHash == null) return false;

        for (var i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.EmailVerificationCodeHash[i]) return false;
        }

        return true;
    }

    public bool ValidatePhoneNumberCode(AppUser user, string code)
    {
        if (user.PhoneNumberVerificationExpiryTime < DateTime.UtcNow) return false;

        if (user.PhoneNumberVerificationCodeSalt == null) return false;

        using var hmac = new HMACSHA512(user.PhoneNumberVerificationCodeSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(code));

        if (user.PhoneNumberVerificationCodeHash == null) return false;

        for (var i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PhoneNumberVerificationCodeHash[i]) return false;
        }

        return true;
    }
}