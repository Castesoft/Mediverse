using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MainService.Core.Interfaces.Services;
using MainService.Core.Settings;
using MainService.Core.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace MainService.Infrastructure.Services;
public class TokenService : ITokenService
{
    private readonly SymmetricSecurityKey _key;
    private readonly UserManager<AppUser> _userManager;
    private readonly TokenSettings _tokenSettings;
    public TokenService(UserManager<AppUser> userManager, IOptions<TokenSettings> tokenSettings)
    {
        _userManager = userManager;
        _tokenSettings = tokenSettings.Value;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_tokenSettings.Key));
    }

    public async Task<string> CreateToken(AppUser user)
    {
        List<Claim> claims = [
            new (JwtRegisteredClaimNames.NameId, user.Id.ToString()),
            new (JwtRegisteredClaimNames.UniqueName, user.UserName),
            new (JwtRegisteredClaimNames.Email, user.Email),
            new ("FirstName", "314"),
        ];

        var roles = await _userManager.GetRolesAsync(user);
        var permissions = await _userManager.GetPermissionsAsync(user);

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        claims.AddRange(permissions.Select(permission => new Claim("Permission", permission)));

        var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

        SecurityTokenDescriptor tokenDescriptor = new () {
            Subject = new (claims),
            Expires = DateTime.Now.AddDays(7),
            SigningCredentials = new (_key, SecurityAlgorithms.HmacSha512Signature),
            Issuer = _tokenSettings.Issuer,
        };

        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}