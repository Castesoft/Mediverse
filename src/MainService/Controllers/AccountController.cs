using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using MainService.Core.DTOs.User;
using MainService.Core.Interfaces.Services;
using MainService.Core.Settings;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MainService.Core.Extensions;

namespace MainService.Controllers;
public class AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IMapper mapper, ITokenService tokenService, ICloudinaryService cloudinaryService, IConfiguration configuration, IEmailService emailService, IUnitOfWork uow, ICodeService codeService, IPhoneService phoneService, IUsersService usersService, IOptions<ClientSettings> clientSettings, IPhotosService photosService) : BaseApiController
{
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<AccountDto>> GetAccountAsync()
    {
        int id = User.GetUserId();

        var itemToReturn = await usersService.GenerateAccountDtoAsync(id);

        return itemToReturn;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AccountDto>> LoginAsync([FromBody]LoginDto request)
    {
        var item = await userManager.Users
            .Include(x => x.UserPhoto)
                .ThenInclude(x => x.Photo)
            .Include(x => x.UserRoles)
                .ThenInclude(x => x.Role)
            .Include(x => x.UserPermissions)
                .ThenInclude(x => x.Permission)
            .SingleOrDefaultAsync(x => x.Email == request.Email);

        if (item == null) return Unauthorized("Correo o contraseña incorrectos.");

        var result = await  signInManager.CheckPasswordSignInAsync(item, request.Password, false);

        if (!result.Succeeded) return Unauthorized("Correo o contraseña incorrectos.");

        var itemToReturn =  mapper.Map<AccountDto>(item);

        itemToReturn.Token = await tokenService.CreateToken(item);

        return itemToReturn;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AccountDto>> RegisterAsync([FromBody] RegisterDto request)
    {
        using var hmac = new HMACSHA512();
        
        if ((await userManager.FindByEmailAsync(request.Email)) != null) 
        return BadRequest("No puede crearse una cuenta con este correo.");

        AppUser user = new();

        user = mapper.Map<AppUser>(request);

        if (request.Gender == "Otro")
            user.Sex = request.OtherGender;

        if ((await userManager.CreateAsync(user, request.Password)).Succeeded)
            return BadRequest("Error al crear cuenta.");

        if (!(await userManager.AddToRolesAsync(user, ["Inversionista"])).Succeeded)
            return BadRequest("No pudo agregarse el usuario al rol.");

        string emailVerificationCode =  codeService.GenerateEmailCode();

        user.EmailVerificationCodeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(emailVerificationCode));
        user.EmailVerificationCodeSalt = hmac.Key;
        user.EmailVerificationExpiryTime = DateTime.UtcNow.AddMinutes(30);

        if (!(await userManager.UpdateAsync(user)).Succeeded) 
        return BadRequest("No pudo actualizarse la información del usuario.");

        string clientUrl = clientSettings.Value.Url;
        string verifyEmailUrl = $"{clientUrl}/auth/verify-email?email={user.Email}";
        string subject = $"🔒 Mediverse: Verifica tu correo {user.FirstName}!";
        string htmlMessage =  emailService.CreateVerifyEmailAddressEmailForRegister(user, verifyEmailUrl, emailVerificationCode);

        await emailService.SendMail(user.Email, subject, htmlMessage);

        var itemToReturn = await usersService.GenerateAccountDtoAsync(user.Id);
        return itemToReturn;
    }

    [Authorize]
    [HttpPut]
    public async Task<ActionResult<AccountDto>> UpdateAsync([FromBody]UserUpdateDto request)
    {
        int id = User.GetUserId();

        var item = await userManager.Users
            .SingleOrDefaultAsync(x => x.Id == id);

        mapper.Map<UserUpdateDto, AppUser>(request, item);

        if (request.Gender == "Otro") item.Sex = request.OtherGender;

        if (!(await userManager.UpdateAsync(item)).Succeeded) 
        return BadRequest("No pudo actualizarse la información del usuario.");

        var itemToReturn = await usersService.GenerateAccountDtoAsync(id);
        return itemToReturn;
    }

    [Authorize]
    [HttpDelete("{email}")]
    public async Task<ActionResult> DeleteAccount(string email)
    {
        var item = await userManager.Users
            .Include(x => x.UserRoles)
                .ThenInclude(x => x.Role)
            .Include(x => x.UserPhoto)
                .ThenInclude(x => x.Photo)
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Email == email);

        if (item == null) return NotFound($"El usuario de correo {email} no existe.");

        var deleteResult = await usersService.DeleteAsync(item);

        if (!deleteResult) return BadRequest("No pudo eliminarse el usuario.");

        return Ok();
    }

    [Authorize]
    [HttpPost("user-photo")]
    public async Task<ActionResult<AccountDto>> SetUserPhotoAsync(IFormFile file)
    {
        int userId = User.GetUserId();

        ImageUploadParams imageUploadParams = new() {
            File = new FileDescription(file.FileName, file.OpenReadStream()),
            Folder = "Mediverse/UserPhoto",
            Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face"),
        };

        var result = await cloudinaryService.Upload(file, imageUploadParams);

        if (result.Error != null) return BadRequest(result.Error.Message);

        Photo photo = new(result, userId);

        uow.PhotoRepository.Add(photo);

        if (!await uow.Complete()) return BadRequest("Error guardando la foto.");

        var accountDto = await usersService.GenerateAccountDtoAsync(userId);

        return accountDto;
    }

    [Authorize]
    [HttpDelete("user-photo")]
    public async Task<ActionResult<AccountDto>> DeleteUserPhotoAsync()
    {
        int userId = User.GetUserId();

        var item = await userManager.Users
            .Include(x => x.UserPhoto)
                .ThenInclude(x => x.Photo)
            .SingleOrDefaultAsync(x => x.Id == userId);

        Photo photo = item.UserPhoto?.Photo;

        if (photo == null) return BadRequest("No tienes foto de perfil.");

        if (!await photosService.DeleteAsync(photo)) return BadRequest("Error eliminando la foto.");

        var accountDto = await usersService.GenerateAccountDtoAsync(userId);

        return accountDto;
    }

    [AllowAnonymous]
    [HttpGet("request-password-reset-token/{email}")]
    public async Task<ActionResult<AccountDto>> RequestPasswordResetTokenWithEmailAsync([FromRoute] string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return NotFound($"El usuario de correo {email} no existe.");
        }

        string rawToken = await userManager.GeneratePasswordResetTokenAsync(user);
        var resetToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(rawToken));
        string clientUrl = clientSettings.Value.Url;
        string resetUrl = $"{clientUrl}/auth/reset-password?resetToken={resetToken}&firstName={user.FirstName}&email={user.Email}";

        string subject = $"🚨 ¡Recupera tu contraseña, {user.FirstName}! 🔒";

        string htmlMessage =  emailService.CreateResetPasswordEmail(user, resetUrl);

        await  emailService.SendMail(email, subject, htmlMessage);

        var accountToReturn =  mapper.Map<AppUser, AccountDto>(user);

        return accountToReturn;
    }

    [HttpPut("reset-password-with-token")]
    public async Task<ActionResult> ResetPasswordWithToken([FromBody] PasswordResetDto request)
    {
        var decodedToken = WebEncoders.Base64UrlDecode(request.Token);
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return NotFound($"El usuario de correo {request.Email} no existe.");

        var verifyPassResult = userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verifyPassResult == PasswordVerificationResult.Success)
            return BadRequest("La nueva contraseña debe ser distinta a la anterior.");

        var result = await userManager.ResetPasswordAsync(user, Encoding.UTF8.GetString(decodedToken), request.Password);

        if (!result.Succeeded)
        {
            if (result.Errors.Any(e => e.Code == "InvalidToken"))
            {
                return BadRequest("El token es inválido.");
            }

            return BadRequest("Error restableciendo contraseña.");
        }

        return Ok();
    }

    [Authorize]
    [HttpPut("password-update")]
    public async Task<ActionResult> ResetPassword(NewPasswordDto request)
    {
        var user = await userManager.Users
            .SingleOrDefaultAsync(u => u.Email == User.GetEmail());

        var result = await  signInManager.CheckPasswordSignInAsync(user, request.CurrentPassword, false);

        if (!result.Succeeded) return Unauthorized("La contraseña actual es incorrecta.");

        var token = await userManager.GeneratePasswordResetTokenAsync(user);

        var identityResult = await userManager.ResetPasswordAsync(user, token, request.NewPassword);

        if (!identityResult.Succeeded) return BadRequest("Error restableciendo contraseña.");

        return Ok();
    }

    [HttpPost("email-verification")]
    public async Task<ActionResult<AccountDto>> EmailVerificationCode([FromBody] EmailVerificationDto request)
    {
        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Email == request.Email);

        if (user == null) return NotFound($"El usuario de correo {request.Email} no existe.");

        if (user.EmailConfirmed) return BadRequest("Este correo ya se encuentra verificado.");

        var result =  codeService.ValidateEmailCode(user, request.Code);

        if (!result) return BadRequest("El código es incorrecto o ha expirado su validez.");

        user.EmailConfirmed = true;
        
        var updateResult = await userManager.UpdateAsync(user);

        if (!updateResult.Succeeded) return BadRequest("Error al actualizar información del usuario.");

        return await usersService.GenerateAccountDtoAsync(user.Id);
    }

    [HttpPost("send-phone-verification-code")]
    public async Task<ActionResult> SendPhoneVerificationCode
        ([FromBody] PhoneVerificationCodeDto request)
    {
        using var hmac = new HMACSHA512();
            
        var user = await userManager.Users
            .SingleOrDefaultAsync(x => x.Email == request.Email);

        if (user == null) return NotFound($"El usuario de correo {request.Email} no existe.");

        string phoneNumberVerificationCode =  codeService.GeneratePhoneNumberCode();

        user.PhoneNumber = request.PhoneNumber;
        user.PhoneNumberCountryCode = request.PhoneNumberCountryCode;

        user.PhoneNumberVerificationCodeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(phoneNumberVerificationCode));
        user.PhoneNumberVerificationCodeSalt = hmac.Key;

        user.PhoneNumberVerificationExpiryTime = DateTime.UtcNow.AddMinutes(30);

        var updateResult = await userManager.UpdateAsync(user);

        if (!updateResult.Succeeded) return BadRequest("Error al actualizar información del usuario.");

        string message = $$"""
        ¡Hola {{user.FirstName}} {{user.LastName}}! Nos complace que te tomes la seguridad de tu información tan seriamente como nosotros.

        El código para verificar este teléfono es el siguiente:

        {{phoneNumberVerificationCode}}

        Gracias por usar Mediverse.
        """;

        var messageResponse = await  phoneService.SendMessage(user.PhoneNumberCountryCode + user.PhoneNumber, message);

        return Ok();
    }

    [HttpPost("phone-verification")] 
    public async Task<ActionResult<AccountDto>> VerifyPhoneNumber
        ([FromBody] PhoneNumberVerificationDto request)
    {
        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Email == request.Email);

        if (user == null) return NotFound($"El usuario de correo {request.Email} no existe.");

        if (user.PhoneNumberConfirmed) return BadRequest("Este número de teléfono ya ha sido verificado.");

        var result =  codeService.ValidatePhoneNumberCode(user, request.Code);

        if (!result) return BadRequest("El código es incorrecto o ha expirado su validez.");

        user.PhoneNumberConfirmed = true;
        
        var updateResult = await userManager.UpdateAsync(user);

        if (!updateResult.Succeeded) return BadRequest("Error al actualizar información del usuario.");

        return await usersService.GenerateAccountDtoAsync(user.Id);
    }

    [HttpGet("emailExists")]
    public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
    {
        return await userManager.FindByEmailAsync(email) != null;
    }

    [HttpGet("usernameExists")]
    public async Task<ActionResult<bool>> CheckUsernameExistsAsync([FromQuery] string username)
    {
        return await userManager.FindByNameAsync(username) != null;
    }

    [HttpGet("phoneNumberExists")]
    public async Task<ActionResult<bool>> CheckPhoneNumberExistsAsync([FromQuery] string phoneNumber)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
        return user != null;
    }

    [Authorize]
    [HttpPut("update-email/{newEmail}")]
    public async Task<ActionResult<AccountDto>> UpdateEmail([FromRoute] string newEmail)
    {
        using var hmac = new HMACSHA512();
            
        var user = await userManager.Users
            .SingleOrDefaultAsync(x => x.Email == User.GetEmail());

        if (user == null) return NotFound($"El usuario de correo {User.GetEmail()} no existe.");

        // update email
        var result = await userManager.SetEmailAsync(user, newEmail);
        if (!result.Succeeded) return BadRequest("Error al actualizar correo.");
        
        // update email confirmation
        user.EmailConfirmed = false;

        string emailVerificationCode =  codeService.GenerateEmailCode();
        user.EmailVerificationCodeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(emailVerificationCode));
        user.EmailVerificationCodeSalt = hmac.Key;

        user.EmailVerificationExpiryTime = DateTime.UtcNow.AddMinutes(30);

        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded) return BadRequest("Error al actualizar información del usuario.");

        // send email verification code
        string clientUrl = clientSettings.Value.Url;
        string subject = $"🔒 Verificación de correo para {user.FirstName}!";
        string htmlMessage =  emailService.CreateVerifyEmailAddressEmailForUpdate(user, emailVerificationCode);
        await  emailService.SendMail(user.Email, subject, htmlMessage);

        // return user
        return await usersService.GenerateAccountDtoAsync(user.Id);
    }
    
    [HttpPut("update-phoneNumber")]
    public async Task<ActionResult<AccountDto>> UpdateEmail(PhoneNumberUpdateDto request)
    {
        using var hmac = new HMACSHA512();

        var user = await userManager.Users
            .SingleOrDefaultAsync(x => x.Email == User.GetEmail());

        if (user == null) return NotFound($"El usuario de número de teléfono {User.GetEmail()} no existe.");

        // update phoneNumber
        var result = await userManager.SetPhoneNumberAsync(user, request.PhoneNumber);
        if (!result.Succeeded) return BadRequest("Error al actualizar número de teléfono.");

        if (user.PhoneNumberCountryCode != request.PhoneNumberCountryCode)
        {
            user.PhoneNumberCountryCode = request.PhoneNumberCountryCode;

            var countryCodeUpdateResult = await userManager.UpdateAsync(user);
            if (!countryCodeUpdateResult.Succeeded) return BadRequest("Error al actualizar el código de país del número de teléfono.");
        }

        // update phoneNumber confirmation
        user.PhoneNumberConfirmed = false;
        string phoneNumberVerificationCode =  codeService.GeneratePhoneNumberCode();

        user.PhoneNumberVerificationCodeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(phoneNumberVerificationCode));
        user.PhoneNumberVerificationCodeSalt = hmac.Key;

        user.PhoneNumberVerificationExpiryTime = DateTime.UtcNow.AddMinutes(30);

        var updateResult = await userManager.UpdateAsync(user);
        
        if (!updateResult.Succeeded) return BadRequest("Error al actualizar información del usuario.");

        // send phoneNumber verification code
        string message = $$"""
        ¡Hola {{user.FirstName}} {{user.LastName}}! Nos complace que te tomes la seguridad de tu información tan seriamente como nosotros.

        El código para verificar este teléfono es el siguiente:

        {{phoneNumberVerificationCode}}

        Gracias por usar Mediverse.
        """;
        
        string fullPhoneNumber = user.PhoneNumberCountryCode + user.PhoneNumber;
        
        var messageResponse = await  phoneService.SendMessage(fullPhoneNumber, message);

        // return user
        return await usersService.GenerateAccountDtoAsync(user.Id);
    }

    [Authorize]
    [HttpGet("resend-email-verification")]
    public async Task<ActionResult> SendEmailVerificationCodeForAccount()
    {
        using var hmac = new HMACSHA512();

        // get user
        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Email == User.GetEmail());
        if (user == null) return NotFound($"No se ha encontrado al usuario.");

        if (user.EmailConfirmed) return BadRequest("Este correo ya se encuentra verificado.");

        // update email confirmation
        user.EmailConfirmed = false;

        string emailVerificationCode =  codeService.GenerateEmailCode();

        user.EmailVerificationCodeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(emailVerificationCode));
        user.EmailVerificationCodeSalt = hmac.Key;
        
        user.EmailVerificationExpiryTime = DateTime.UtcNow.AddMinutes(30);

        var updateResult = await userManager.UpdateAsync(user);
        
        if (!updateResult.Succeeded) return BadRequest("Error al actualizar información del usuario.");

        // send email verification code
        string clientUrl =  configuration.GetValue<string>("ClientUrl");
        string subject = $"🔒 Verificación de correo para {user.FirstName}!";
        string htmlMessage =  emailService.CreateVerifyEmailAddressEmailForUpdate(user, emailVerificationCode);
        await  emailService.SendMail(user.Email, subject, htmlMessage);

        return Ok();
    }

    [Authorize]
    [HttpGet("resend-phoneNumber-verification")]
    public async Task<ActionResult> SendPhoneNumberVerificationCodeForAccount()
    {
        using var hmac = new HMACSHA512();

        // get user
        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Email == User.GetEmail());
        if (user == null) return NotFound($"No se ha encontrado al usuario.");

        if (user.PhoneNumberConfirmed) return BadRequest("Este número de teléfono ya se encuentra verificado.");

        // update phoneNumber confirmation
        user.PhoneNumberConfirmed = false;
        string phoneNumberVerificationCode =  codeService.GeneratePhoneNumberCode();

        user.PhoneNumberVerificationCodeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(phoneNumberVerificationCode));
        user.PhoneNumberVerificationCodeSalt = hmac.Key;

        user.PhoneNumberVerificationExpiryTime = DateTime.UtcNow.AddMinutes(30);

        var updateResult = await userManager.UpdateAsync(user);

        if (!updateResult.Succeeded) return BadRequest("Error al actualizar información del usuario.");

        // send phoneNumber verification code
        string message = $$"""
        ¡Hola {{user.FirstName}} {{user.LastName}}! Nos complace que te tomes la seguridad de tu información tan seriamente como nosotros.
        
        El código para verificar este teléfono es el siguiente:
        
        {{phoneNumberVerificationCode}}

        Gracias por usar Mediverse.
        """;

        var messageResponse = await  phoneService.SendMessage(user.PhoneNumberCountryCode + user.PhoneNumber, message);

        return Ok();
    }
}