using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;
public interface ICodeService
{
    string GenerateEmailCode();
    string GeneratePhoneNumberCode();
    bool ValidateEmailCode(AppUser user, string code);
    bool ValidatePhoneNumberCode(AppUser user, string code);
}