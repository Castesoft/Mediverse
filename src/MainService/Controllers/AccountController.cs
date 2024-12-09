

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
using System.Text.Json;
using MainService.Core.DTOs;
using MainService.Models.Entities.Aggregate;

namespace MainService.Controllers;
public class AccountController(
    UserManager<AppUser> userManager, 
    SignInManager<AppUser> signInManager, 
    IMapper mapper, 
    ITokenService tokenService, 
    ICloudinaryService cloudinaryService,
    IGoogleService googleService, 
    IConfiguration configuration, 
    IEmailService emailService, 
    ITwoFactorAuthService twoFactorAuthService, 
    IQRCoderService qrCoderService, 
    IUnitOfWork uow, 
    ICodeService codeService, 
    IPhoneService phoneService, 
    IUsersService usersService, 
    IOptions<ClientSettings> clientSettings, 
    IPhotosService photosService,
    IStripeService stripeService
) : BaseApiController
{
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<AccountDto?>> GetAccountAsync() => await usersService.GenerateAccountDtoAsync(User.GetUserId());

    [HttpPost("login")]
    public async Task<ActionResult<AccountDto?>> LoginAsync([FromBody]LoginDto request)
    {
        AppUser? user = await userManager.FindByEmailAsync(request.Email);

        if (user == null) return Unauthorized("Correo o contraseña incorrectos.");

        var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, false);

        if (!result.Succeeded) return Unauthorized("Correo o contraseña incorrectos.");

        if (user.TwoFactorEnabled)
        {
            return Ok(new { RequiresTwoFactor = true });
        }

        AccountDto? itemToReturn = await usersService.GenerateAccountDtoAsync(user.Id);

        return itemToReturn;
    }

    [Authorize]
    [HttpGet("current")]
    public async Task<ActionResult<AccountDto?>> GetCurrentUserAsync() => await usersService.GenerateAccountDtoAsync(User.GetUserId());

    [HttpPost("login-two-factor")]
    public async Task<ActionResult<AccountDto>> LoginTwoFactorAsync([FromBody] TwoFactorLoginDto request)
    {
        AppUser? user = await userManager.FindByEmailAsync(request.Email);

        if (user == null) return Unauthorized("No se ha encontrado al usuario.");

        var validVerification = await userManager.VerifyTwoFactorTokenAsync(user, userManager.Options.Tokens.AuthenticatorTokenProvider, request.VerificationCode);

        if (!validVerification) return Unauthorized("Código de verificación incorrecto.");

        AccountDto? itemToReturn = await usersService.GenerateAccountDtoAsync(user.Id);

        itemToReturn!.Token = await tokenService.CreateToken(user);

        return itemToReturn;
    }

    [HttpPost("login-social")]
    public async Task<ActionResult<AccountDto?>> LoginSocialAsync([FromBody] SocialAuthDto request)
    {
        var payload = await googleService.VerifyGoogleTokenAsync(request.AccessToken);

        if (payload == null) return Unauthorized("Token inválido.");

        UserLoginInfo info = new(request.Provider, payload.Subject, request.Provider);

        AppUser? user = await userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
        if (user == null)
        {
            user = await userManager.FindByEmailAsync(payload.Email);

            if (user == null)
            {
                AppUser newUser = mapper.Map<AppUser>(payload);

                newUser.UserPhoto = new() { Photo = new() { Url = payload.Picture } };

                var createUser = await userManager.CreateAsync(newUser);
                if (!createUser.Succeeded) return BadRequest(createUser.Errors);

                var addRole = await userManager.AddToRolesAsync(newUser, ["Patient"]);
                if (!addRole.Succeeded) return BadRequest(addRole.Errors);

                await userManager.AddLoginAsync(newUser, info);

                user = newUser;
            }
            else
            {
                await userManager.AddLoginAsync(user, info);
            }
        }

        if (user == null) return Unauthorized("Autenticación externa inválida.");

        var itemToReturn = await usersService.GenerateAccountDtoAsync(user.Id);

        return itemToReturn;
    }

    [Authorize]
    [HttpPut("link-social")]
    public async Task<ActionResult> LinkSocialAsync([FromBody] SocialAuthDto request)
    {
        var payload = await googleService.VerifyGoogleTokenAsync(request.AccessToken);

        if (payload == null) return Unauthorized("Token inválido.");

        UserLoginInfo info = new(request.Provider, payload.Subject, request.Provider);

        string email = User.GetEmail();

        if (email != payload.Email) return BadRequest("El correo no coincide con el de la cuenta.");

        AppUser? user = await userManager.FindByEmailAsync(email);

        if (user == null) return NotFound("No se ha encontrado al usuario.");

        var loginExists = await userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
        if (loginExists != null) return BadRequest("Ya existe una cuenta con este proveedor.");

        await userManager.AddLoginAsync(user, info);

        return Ok();
    }

    [HttpPost("register")]
    public async Task<ActionResult<AccountDto?>> RegisterAsync([FromBody] RegisterDto request)
    {
        using var hmac = new HMACSHA512();
        
        if ((await userManager.FindByEmailAsync(request.Email)) != null) 
        return BadRequest("No puede crearse una cuenta con este correo.");

        AppUser user = new();

        user = mapper.Map<AppUser>(request);

        user.UserName = request.Email;

        if (request.Gender == "Otro")
            user.Sex = request.OtherGender;

        var createUser = await userManager.CreateAsync(user, request.Password);
        if (!createUser.Succeeded) return BadRequest(createUser.Errors);

        var addRole = await userManager.AddToRolesAsync(user, ["Patient"]);
        if (!addRole.Succeeded) return BadRequest(addRole.Errors);

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

    [HttpPost("register-doctor")]
    public async Task<ActionResult<AccountDto?>> RegisterDoctorAsync([FromForm] IFormFile file, [FromForm] string json)
    {
        if (file == null || file.Length == 0) return BadRequest("No se ha enviado una prueba de especialidad.");

        DoctorRegisterDto? request = JsonSerializer.Deserialize<DoctorRegisterDto>(json);

        using var hmac = new HMACSHA512();

        if (request != null) {
            if ((await userManager.FindByEmailAsync(request.Email)) != null)
            return BadRequest("No puede crearse una cuenta con este correo.");

            AppUser user = new();

            user = mapper.Map<AppUser>(request);

            user.UserName = request.Email;

            if (request.Gender == "Otro")
                user.Sex = request.OtherGender;

            var createUser = await userManager.CreateAsync(user, request.Password);
            if (!createUser.Succeeded) return BadRequest(createUser.Errors);

            var addRole = await userManager.AddToRolesAsync(user, ["Patient", "Doctor"]);
            if (!addRole.Succeeded) return BadRequest(addRole.Errors);

            // Create doctor properties
            var mainAddress = new UserAddress
            {
                UserId = user.Id,
                Address = new Address
                {
                    State = request.State,
                    City = request.City,
                    Street = request.Street,
                    Zipcode = request.Zipcode,
                    Neighborhood = request.Neighborhood,
                    ExteriorNumber = request.ExteriorNumber,
                    InteriorNumber = request.InteriorNumber,
                    Country = "México"
                },
                IsMain = true,
                IsBilling = request.SameAddress ? true : false
            };

            var (latitude, longitude) = await googleService.GetAddressCoordinatesAsync(googleService.GetAddressText(mainAddress.Address));
            mainAddress.Address.Latitude = latitude;
            mainAddress.Address.Longitude = longitude;

            user.UserAddresses.Add(mainAddress);
            user.DoctorClinics.Add(new() {Clinic = mainAddress.Address, IsMain = true});

            if (!request.SameAddress)
            {
                var billingAddress = new UserAddress
                {
                    UserId = user.Id,
                    Address = new Address
                    {
                        State = request.BillingState,
                        City = request.BillingCity,
                        Street = request.BillingAddress,
                        Zipcode = request.BillingZipcode,
                        Neighborhood = request.BillingNeighborhood,
                        ExteriorNumber = request.BillingExteriorNumber,
                        InteriorNumber = request.BillingInteriorNumber,
                        Country = "México"
                    },
                    IsMain = false,
                    IsBilling = true
                };
                (latitude, longitude) = await googleService.GetAddressCoordinatesAsync(googleService.GetAddressText(billingAddress.Address));
                billingAddress.Address.Latitude = latitude;
                billingAddress.Address.Longitude = longitude;
                user.UserAddresses.Add(billingAddress);
            }

            var paymentMethod = new UserPaymentMethod
            {
                UserId = user.Id,
                IsMain = true,
                PaymentMethod = new PaymentMethod
                {
                    DisplayName = request.DisplayName,
                    StripePaymentMethodId = request.StripePaymentMethodId,
                    Last4 = request.Last4,
                    ExpirationMonth = request.ExpirationMonth,
                    ExpirationYear = request.ExpirationYear,
                    Brand = request.Brand,
                    Country = request.Country
                }
            };
            user.UserPaymentMethods.Add(paymentMethod);

            List<int> acceptedPaymentMethods = request.AcceptedPaymentMethods.Split(',').Select(int.Parse).ToList();
            foreach (var paymentMethodTypeId in acceptedPaymentMethods)
            {
                var paymentMethodType = new DoctorPaymentMethodType
                {
                    DoctorId = user.Id,
                    PaymentMethodTypeId = paymentMethodTypeId
                };
                user.DoctorPaymentMethodTypes.Add(paymentMethodType);
            }

            if (await uow.SpecialtyRepository.GetByIdAsync(int.Parse(request.SpecialtyId)) == null)
                return BadRequest($"La especialidad con id {request.SpecialtyId} no existe.");

            var uploadResult = await cloudinaryService.UploadAsync(file, new() {
                File = new FileDescription(file.FileName, file.OpenReadStream()),
                Folder = "Mediverse/DoctorMedicalLicenses",
            });
            if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);

            user.UserMedicalLicenses.Add(new (int.Parse(request.SpecialtyId), uploadResult.PublicId, uploadResult.SecureUrl.AbsoluteUri) { IsMain = true });

            string customerId = await stripeService.CreateCustomerAsync(user.Email, user.FirstName + " " + user.LastName, request.StripePaymentMethodId);
            user.StripeCustomerId = customerId;

            string emailVerificationCode = codeService.GenerateEmailCode();

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
        return BadRequest("Error al registrar al doctor.");
    }

    [Authorize]
    [HttpGet("two-factor-setup")]
    public async Task<ActionResult<TwoFactorSetupDto>> GetTwoFactorSetupAsync()
    {
        int userId = User.GetUserId();

        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        var (sharedKey, authenticatorUri) = await twoFactorAuthService.GenerateTwoFactorTokenAsync(user);
        var qrCode = qrCoderService.GenerateQRCode(authenticatorUri);

        return new TwoFactorSetupDto
        {
            SharedKey = sharedKey,
            AuthenticatorUri = authenticatorUri,
            QrCode = qrCode
        };
    }

    [Authorize]
    [HttpPost("two-factor-verify")]
    public async Task<ActionResult> VerifyTwoFactorAsync([FromBody] TwoFactorVerifyDto request)
    {
        int userId = User.GetUserId();

        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        var isTokenValid = await userManager.VerifyTwoFactorTokenAsync(user, userManager.Options.Tokens.AuthenticatorTokenProvider, request.VerificationCode);

        if (!isTokenValid) return BadRequest("El token es inválido.");

        user.TwoFactorEnabled = true;

        if (!(await userManager.UpdateAsync(user)).Succeeded) 
        return BadRequest("No pudo actualizarse la información del usuario.");

        return Ok();
    }

    [Authorize]
    [HttpDelete("two-factor")]
    public async Task<ActionResult> DeleteTwoFactorAsync()
    {
        int userId = User.GetUserId();

        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        user.TwoFactorEnabled = false;

        if (!(await userManager.UpdateAsync(user)).Succeeded)
        return BadRequest("No pudo actualizarse la información del usuario.");

        await userManager.ResetAuthenticatorKeyAsync(user);

        return Ok();
    }

    [Authorize]
    [HttpPut]
    public async Task<ActionResult<AccountDto?>> UpdateAsync([FromBody]UserUpdateDto request)
    {
        int id = User.GetUserId();

        AppUser? item = await userManager.Users.SingleOrDefaultAsync(x => x.Id == id);

        if (item != null) {
            mapper.Map<UserUpdateDto, AppUser>(request, item);

            if (request.Gender == "Otro") item.Sex = request.OtherGender;

            if (!(await userManager.UpdateAsync(item)).Succeeded) 
            return BadRequest("No pudo actualizarse la información del usuario.");

            var itemToReturn = await usersService.GenerateAccountDtoAsync(id);
            return itemToReturn;
        }
        return NotFound($"El usuario con id {id} no existe.");
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
    public async Task<ActionResult<AccountDto?>> SetUserPhotoAsync(IFormFile file)
    {
        int userId = User.GetUserId();

        ImageUploadParams imageUploadParams = new() {
            File = new FileDescription(file.FileName, file.OpenReadStream()),
            Folder = "Mediverse/UserPhoto",
            Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face"),
        };

        var result = await cloudinaryService.UploadAsync(file, imageUploadParams);

        if (result.Error != null) return BadRequest(result.Error.Message);

        Photo photo = new(result, userId);

        uow.PhotoRepository.Add(photo);

        if (!await uow.Complete()) return BadRequest("Error guardando la foto.");

        var accountDto = await usersService.GenerateAccountDtoAsync(userId);

        return accountDto;
    }

    [Authorize]
    [HttpDelete("user-photo")]
    public async Task<ActionResult<AccountDto?>> DeleteUserPhotoAsync()
    {
        int userId = User.GetUserId();

        var item = await userManager.Users
            .Include(x => x.UserPhoto)
                .ThenInclude(x => x.Photo)
            .SingleOrDefaultAsync(x => x.Id == userId);

        Photo? photo = item?.UserPhoto?.Photo;

        if (photo == null) return BadRequest("No tienes foto de perfil.");

        if (!await photosService.DeleteAsync(photo)) return BadRequest("Error eliminando la foto.");

        var accountDto = await usersService.GenerateAccountDtoAsync(userId);

        return accountDto;
    }

    [Authorize]
    [HttpPut("doctor-banner")]
    public async Task<ActionResult<AccountDto?>> SetDoctorBannerPhotoAsync(IFormFile file)
    {
        int userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.UserRoles)
                .ThenInclude(x => x.Role)
            .Include(x => x.DoctorBannerPhoto)
                .ThenInclude(x => x.Photo)
            .SingleOrDefaultAsync(x => x.Id == userId);
        
        if (user == null) return NotFound($"El usuario con id {userId} no existe.");
        if (!user.UserRoles.Any(x => x.Role.Name == "Doctor")) return BadRequest("No tienes permisos para realizar esta acción.");

        Photo? bannerPhoto = user.DoctorBannerPhoto?.Photo;
        if (bannerPhoto != null)
        {
            if (!await photosService.DeleteAsync(bannerPhoto)) return BadRequest("Error eliminando la foto de portada.");
        }

        ImageUploadParams imageUploadParams = new() {
            File = new FileDescription(file.FileName, file.OpenReadStream()),
            Folder = "Mediverse/DoctorBannerPhoto",
        };

        var result = await cloudinaryService.UploadAsync(file, imageUploadParams);

        if (result.Error != null) return BadRequest(result.Error.Message);

        user.DoctorBannerPhoto = new() {
            Photo = new() { Url = result.SecureUrl.AbsoluteUri, PublicId = result.PublicId },
            UserId = userId
        };

        if (!await uow.Complete()) return BadRequest("Error guardando la foto.");

        var accountDto = await usersService.GenerateAccountDtoAsync(userId);

        return accountDto;
    }

    [AllowAnonymous]
    [HttpGet("request-password-reset-token/{email}")]
    public async Task<ActionResult<AccountDto?>> RequestPasswordResetTokenWithEmailAsync([FromRoute] string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return NotFound($"El usuario de correo {email} no existe.");
        }

        string rawToken = await userManager.GeneratePasswordResetTokenAsync(user);
        var resetToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(rawToken));
        string clientUrl = clientSettings.Value.Url;
        string resetUrl = $"{clientUrl}/auth/sign-in/new-password?resetToken={resetToken}&firstName={user.FirstName}&email={user.Email}";

        string subject = $"🚨 ¡Recupera tu contraseña, {user.FirstName}! 🔒";

        string htmlMessage =  emailService.CreateResetPasswordEmail(user, resetUrl);

        await  emailService.SendMail(email, subject, htmlMessage);

        var accountToReturn = mapper.Map<AppUser, AccountDto>(user);

        return accountToReturn;
    }

    [HttpPut("reset-password-with-token")]
    public async Task<ActionResult> ResetPasswordWithToken([FromBody] PasswordResetDto request)
    {
        var decodedToken = WebEncoders.Base64UrlDecode(request.Token);
        AppUser? user = await userManager.FindByEmailAsync(request.Email);
        if (user == null) return NotFound($"El usuario de correo {request.Email} no existe.");

        if (!string.IsNullOrEmpty(user.PasswordHash)) {
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

        return BadRequest("No se ha establecido una contraseña para este usuario.");
    }

    [Authorize]
    [HttpPut("set-password")]
    public async Task<ActionResult> SetPassword([FromBody] PasswordSetDto request)
    {
        if (request.Password != request.ConfirmPassword) return BadRequest("Las contraseñas no coinciden.");

        AppUser? user = await userManager.Users.SingleOrDefaultAsync(u => u.Email == User.GetEmail());

        if (user == null) return NotFound($"El usuario de correo {User.GetEmail()} no existe.");

        if (user?.PasswordHash != null) return BadRequest("Ya tienes una contraseña establecida.");

        var result = await userManager.AddPasswordAsync(user!, request.Password);

        if (!result.Succeeded) return BadRequest("Error estableciendo contraseña.");

        return Ok();
    }

    [Authorize]
    [HttpPut("password-update")]
    public async Task<ActionResult> ResetPassword(NewPasswordDto request)
    {
        AppUser? user = await userManager.Users.SingleOrDefaultAsync(u => u.Email == User.GetEmail());

        if (user == null) return NotFound($"El usuario de correo {User.GetEmail()} no existe.");

        var result = await  signInManager.CheckPasswordSignInAsync(user, request.CurrentPassword, false);

        if (!result.Succeeded) return Unauthorized("La contraseña actual es incorrecta.");

        var token = await userManager.GeneratePasswordResetTokenAsync(user);

        var identityResult = await userManager.ResetPasswordAsync(user, token, request.NewPassword);

        if (!identityResult.Succeeded) return BadRequest("Error restableciendo contraseña.");

        return Ok();
    }

    [HttpPost("email-verification")]
    public async Task<ActionResult<AccountDto?>> EmailVerificationCode([FromBody] EmailVerificationDto request)
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
    public async Task<ActionResult> SendPhoneVerificationCode([FromBody] PhoneVerificationCodeDto request)
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
    public async Task<ActionResult<AccountDto?>> VerifyPhoneNumber([FromBody] PhoneNumberVerificationDto request)
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
    public async Task<ActionResult<AccountDto?>> UpdateEmail([FromRoute] string newEmail)
    {
        using var hmac = new HMACSHA512();

        var user = await userManager.Users
            .SingleOrDefaultAsync(x => x.Email == User.GetEmail());

        if (user == null) return NotFound($"El usuario de correo {User.GetEmail()} no existe.");

        var result = await userManager.SetEmailAsync(user, newEmail);
        if (!result.Succeeded) return BadRequest("Error al actualizar correo.");

        var logins = await userManager.GetLoginsAsync(user);
        foreach (var login in logins)
        {
            var removeLoginResult = await userManager.RemoveLoginAsync(user, login.LoginProvider, login.ProviderKey);
            if (!removeLoginResult.Succeeded) return BadRequest("Error al desvincular cuentas sociales.");
        }

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
    public async Task<ActionResult<AccountDto?>> UpdateEmail(PhoneNumberUpdateDto request)
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
        string? clientUrl =  configuration.GetValue<string>("ClientUrl");
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

    [Authorize]
    [HttpGet("billing-details")]
    public async Task<ActionResult<BillingDetailsDto?>> GetBillingDetails()
    {
        int userId = User.GetUserId();

        BillingDetailsDto? itemToReturn = await usersService.GetBillingDetailsAsync(userId);

        if (itemToReturn == null) return NotFound($"No se han encontrado detalles de facturación para el usuario con id {userId}.");

        itemToReturn.UserPaymentMethods = [..itemToReturn.UserPaymentMethods.OrderBy(x => !x.IsMain)];
        itemToReturn.UserAddresses = [..itemToReturn.UserAddresses.OrderBy(x => !x.IsBilling)];

        return itemToReturn;
    }

    [Authorize]
    [HttpPost("payment-method")]
    public async Task<ActionResult<UserPaymentMethodDto>> AddPaymentMethod(UserPaymentMethodCreateDto request)
    {
        int userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.UserPaymentMethods)
                .ThenInclude(x => x.PaymentMethod)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        if (user.UserPaymentMethods.Count == 0)
        {
            string customerId = await stripeService.CreateCustomerAsync(user.Email, user.FirstName + " " + user.LastName, request.StripePaymentMethodId);
            user.StripeCustomerId = customerId;
        }

        if (request.IsMain)
        {
            var mainPaymentMethod = user.UserPaymentMethods.SingleOrDefault(x => x.IsMain);
            if (mainPaymentMethod != null) mainPaymentMethod.IsMain = false;
        }

        user.UserPaymentMethods.Add(new() {
            UserId = userId,
            IsMain = request.IsMain,
            PaymentMethod = new()
            {
                DisplayName = request.DisplayName,
                StripePaymentMethodId = request.StripePaymentMethodId,
                Last4 = request.Last4,
                ExpirationMonth = request.ExpirationMonth,
                ExpirationYear = request.ExpirationYear,
                Brand = request.Brand,
                Country = request.Country
            }
        });

        if (!await stripeService.AddPaymentMethodAsync(user.StripeCustomerId, request.StripePaymentMethodId, request.IsMain))
            return BadRequest("Error agregando el método de pago a Stripe.");

        if (!await uow.Complete()) return BadRequest("Error guardando el método de pago.");

        return mapper.Map<UserPaymentMethodDto>(user.UserPaymentMethods.Last());
    }

    [Authorize]
    [HttpDelete("payment-method/{paymentMethodId}")]
    public async Task<ActionResult> DeletePaymentMethod(string paymentMethodId)
    {
        int userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.UserPaymentMethods)
                .ThenInclude(x => x.PaymentMethod)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        UserPaymentMethod? paymentMethod = user.UserPaymentMethods.SingleOrDefault(x => x.PaymentMethod.StripePaymentMethodId == paymentMethodId);
        if (paymentMethod == null) return NotFound($"El método de pago con id {paymentMethodId} no existe.");

        if (paymentMethod.IsMain) return BadRequest("No puedes eliminar tu método de pago principal.");

        user.UserPaymentMethods.Remove(paymentMethod);

        if (!await stripeService.DeletePaymentMethodAsync(paymentMethodId))
            return BadRequest("Error eliminando el método de pago de Stripe.");

        if (!await uow.Complete()) return BadRequest("Error eliminando el método de pago.");

        return Ok();
    }

    [Authorize]
    [HttpPut("payment-method/{paymentMethodId}")]
    public async Task<ActionResult> SetMainPaymentMethod(string paymentMethodId)
    {
        int userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.UserPaymentMethods)
                .ThenInclude(x => x.PaymentMethod)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        UserPaymentMethod? paymentMethod = user.UserPaymentMethods.SingleOrDefault(x => x.PaymentMethod.StripePaymentMethodId == paymentMethodId);
        if (paymentMethod == null) return NotFound($"El método de pago con id {paymentMethodId} no existe.");

        UserPaymentMethod? mainPaymentMethod = user.UserPaymentMethods.SingleOrDefault(x => x.IsMain);
        if (mainPaymentMethod?.PaymentMethod.StripePaymentMethodId == paymentMethodId) return BadRequest("Este método de pago ya es el principal.");
        if (mainPaymentMethod != null) mainPaymentMethod.IsMain = false;

        paymentMethod.IsMain = true;

        if (!await stripeService.SetMainPaymentMethodAsync(user.StripeCustomerId, paymentMethodId))
            return BadRequest("Error actualizando el método de pago en Stripe.");

        if (!await uow.Complete()) return BadRequest("Error actualizando el método de pago.");

        return Ok();
    }

    [Authorize]
    [HttpPost("address")]
    public async Task<ActionResult<UserAddressDto>> AddAddress(UserAddressCreateDto request)
    {
        int userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.UserAddresses)
                .ThenInclude(x => x.Address)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        if (request.IsMain)
        {
            var mainAddress = user.UserAddresses.SingleOrDefault(x => x.IsMain);
            if (mainAddress != null) mainAddress.IsMain = false;
        }

        if (request.IsBilling)
        {
            var billingAddress = user.UserAddresses.SingleOrDefault(x => x.IsBilling);
            if (billingAddress != null) billingAddress.IsBilling = false;
        }

        var (latitude, longitude) = await googleService.GetAddressCoordinatesAsync(googleService.GetAddressText(mapper.Map<Address>(request)));

        user.UserAddresses.Add(new() {
            UserId = userId,
            IsMain = request.IsMain,
            IsBilling = request.IsBilling,
            Address = new()
            {
                Neighborhood = request.Neighborhood,
                ExteriorNumber = request.ExteriorNumber,
                InteriorNumber = request.InteriorNumber,
                Country = request.Country,
                State = request.State,
                City = request.City,
                Street = request.Street,
                Zipcode = request.Zipcode,
                Latitude = latitude,
                Longitude = longitude
            }
        });

        if (!await uow.Complete()) return BadRequest("Error guardando la dirección.");

        return mapper.Map<UserAddressDto>(user.UserAddresses.Last());
    }

    [Authorize]
    [HttpDelete("address/{addressId}")]
    public async Task<ActionResult> DeleteAddress(int addressId)
    {
        int userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.UserAddresses)
                .ThenInclude(x => x.Address)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        UserAddress? address = user.UserAddresses.SingleOrDefault(x => x.Address.Id == addressId);
        if (address == null) return NotFound($"La dirección con id {addressId} no existe.");

        if (address.IsMain) return BadRequest("No puedes eliminar tu dirección principal.");

        user.UserAddresses.Remove(address);

        if (!await uow.Complete()) return BadRequest("Error eliminando la dirección.");

        return Ok();
    }

    [Authorize]
    [HttpPut("address/{addressId}")]
    public async Task<ActionResult> UpdateAddress(int addressId, UserAddressUpdateDto request)
    {
        int userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.UserAddresses)
                .ThenInclude(x => x.Address)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        UserAddress? address = user.UserAddresses.SingleOrDefault(x => x.Address.Id == addressId);
        if (address == null) return NotFound($"La dirección con id {addressId} no existe.");

        if (request.IsMain)
        {
            var mainAddress = user.UserAddresses.SingleOrDefault(x => x.IsMain);
            if (mainAddress != null) mainAddress.IsMain = false;
        }

        if (request.IsBilling)
        {
            var billingAddress = user.UserAddresses.SingleOrDefault(x => x.IsBilling);
            if (billingAddress != null) billingAddress.IsBilling = false;
        }

        var (latitude, longitude) = await googleService.GetAddressCoordinatesAsync(googleService.GetAddressText(mapper.Map<Address>(request)));

        address.IsMain = request.IsMain;
        address.IsBilling = request.IsBilling;
        address.Address.State = request.State;
        address.Address.City = request.City;
        address.Address.Street = request.Street;
        address.Address.Zipcode = request.Zipcode;
        address.Address.Latitude = latitude;
        address.Address.Longitude = longitude;
        address.Address.Neighborhood = request.Neighborhood;
        address.Address.ExteriorNumber = request.ExteriorNumber;
        address.Address.InteriorNumber = request.InteriorNumber;

        if (!uow.HasChanges()) return Ok();
        if (!await uow.Complete()) return BadRequest("Error actualizando la dirección.");

        return Ok();
    }

    [Authorize]
    [HttpGet("medical-insurance-companies-fields")]
    public async Task<ActionResult<List<OptionDto>>> GetMedicalInsuranceCompanyOptionsAsync()
    {
        return await uow.MedicalInsuranceCompanyRepository.GetOptionsAsync();
    }

    [Authorize]
    [HttpGet("payment-history")]
    public async Task<ActionResult<List<PaymentDto>>> GetPaymentHistory()
    {
        int userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.PatientEvents)
                .ThenInclude(x => x.Event)
                .ThenInclude(x => x.EventPayments)
                .ThenInclude(x => x.Payment)
                .ThenInclude(x => x.PaymentPaymentMethodType)
                .ThenInclude(x => x.PaymentMethodType)
            .Include(x => x.PatientEvents)
                .ThenInclude(x => x.Event)
                .ThenInclude(x => x.EventPayments)
                .ThenInclude(x => x.Payment)
                .ThenInclude(x => x.PaymentPaymentMethod)
                .ThenInclude(x => x.PaymentMethod)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        return mapper.Map<List<PaymentDto>>(user.PatientEvents.SelectMany(x => x.Event.EventPayments.Select(y => y.Payment)));
    }

    [Authorize]
    [HttpGet("medical-insurance-companies")]
    public async Task<ActionResult<List<UserMedicalInsuranceCompanyDto>>> GetMedicalInsuranceCompanies()
    {
        int userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.UserMedicalInsuranceCompanies)
                .ThenInclude(x => x.MedicalInsuranceCompany)
                .ThenInclude(x => x.MedicalInsuranceCompanyPhoto)
                .ThenInclude(x => x.Photo)
            .Include(x => x.UserMedicalInsuranceCompanies)
                .ThenInclude(x => x.Document)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        return mapper.Map<List<UserMedicalInsuranceCompanyDto>>(user.UserMedicalInsuranceCompanies);
    }

    [Authorize]
    [HttpPost("medical-insurance-company")]
    public async Task<ActionResult<AccountDto?>> AddMedicalInsuranceCompanyAsync([FromForm] UserMedicalInsuranceCompanyCreateDto request)
    {
        int userId = User.GetUserId();

        if (request.MedicalInsuranceCompany == null) return BadRequest("No se ha enviado la compañía de seguro médico.");
        if (!request.MedicalInsuranceCompany.Id.HasValue) return BadRequest("No se ha enviado el ID de la compañía de seguro médico.");
        if (!request.IsMain.HasValue) return BadRequest("No se ha enviado si la compañía de seguro médico es principal o no.");
        if (request.File == null) return BadRequest("No se ha enviado el documento.");
        if (string.IsNullOrEmpty(request.PolicyNumber)) return BadRequest("No se ha enviado el número de póliza.");

        if (!await uow.UserRepository.ExistsByIdAsync(userId))
        return BadRequest($"Usuario de ID {userId} no fue encontrado.");

        if (!await uow.MedicalInsuranceCompanyRepository.ExistsByIdAsync(request.MedicalInsuranceCompany.Id.Value))
        return BadRequest($"Compañía de seguro médico de ID {request.MedicalInsuranceCompany.Id.Value} no fue encontrada.");

        IFormFile file = request.File;
        bool isMain = request.IsMain.Value;
        OptionDto medicalInsuranceCompany = request.MedicalInsuranceCompany;
        string policyNumber = request.PolicyNumber;
        AppUser? user = await userManager.Users
            .Include(x => x.UserMedicalInsuranceCompanies)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        if (user.UserMedicalInsuranceCompanies.Any(x => x.MedicalInsuranceCompanyId == medicalInsuranceCompany.Id))
        return BadRequest("Ya tienes esta compañía de seguro médico registrada.");

        ImageUploadResult uploadResult = await cloudinaryService.UploadAsync(file, new() {
            File = new FileDescription(file.FileName, file.OpenReadStream()),
            Folder = "Mediverse/UserMedicalInsuranceCompanies",
        });

        if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);

        ImageUploadResult uploadThumbnailResult = await cloudinaryService.UploadAsync(file, new() {
            File = new FileDescription(file.FileName, file.OpenReadStream()),
            Folder = "Mediverse/UserMedicalInsuranceCompanies/Thumbnails",
            Format = "jpg",
            Transformation = new Transformation().Page(1).Height(300).Width(400).Crop("fill").Gravity("north")
        });

        if (uploadThumbnailResult.Error != null) return BadRequest(uploadThumbnailResult.Error.Message);

        if (isMain)
        {
            UserMedicalInsuranceCompany? mainMedicalInsuranceCompany = user.UserMedicalInsuranceCompanies.FirstOrDefault(x => x.IsMain);
            if (mainMedicalInsuranceCompany != null) mainMedicalInsuranceCompany.IsMain = false;
        }

        user.UserMedicalInsuranceCompanies.Add(new() {
            MedicalInsuranceCompanyId = medicalInsuranceCompany.Id.Value,
            IsMain = isMain,
            PolicyNumber = request.PolicyNumber,
            Document = new() {
                Url = uploadResult.SecureUrl.AbsoluteUri,
                PublicId = uploadResult.PublicId,
                ThumbnailUrl = uploadThumbnailResult.SecureUrl.AbsoluteUri,
                ThumbnailPublicId = uploadThumbnailResult.PublicId,
                Name = file.FileName,
                Size = (int)file.Length,
            }
        });

        if (!await uow.Complete()) return BadRequest("Error guardando la compañía de seguro médico.");

        return await usersService.GenerateAccountDtoAsync(userId);
    }

    [Authorize]
    [HttpDelete("medical-insurance-company/{insuranceId}")]
    public async Task<ActionResult<AccountDto?>> DeleteInsuranceByIdAsync([FromRoute]int insuranceId)
    {
        int userId = User.GetUserId();

        AppUser? user = await userManager.Users
            .Include(x => x.UserMedicalInsuranceCompanies)
                .ThenInclude(x => x.Document)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        if (!await uow.MedicalInsuranceCompanyRepository.ExistsByIdAsync(insuranceId))
        return BadRequest($"La compañía de seguro médico con id {insuranceId} no existe.");

        UserMedicalInsuranceCompany? toDelete = user.UserMedicalInsuranceCompanies.SingleOrDefault(x => x.MedicalInsuranceCompanyId == insuranceId);
        if (toDelete == null) return NotFound($"No estás registrado con la compañía de seguro médico con id {insuranceId}.");

        user.UserMedicalInsuranceCompanies.Remove(toDelete);
        if (!await uow.Complete()) return BadRequest("Error eliminando la compañía de seguro médico.");

        if (toDelete.Document != null) {
            if (!string.IsNullOrEmpty(toDelete.Document.PublicId)) {
                DeletionResult deleteResponse = await cloudinaryService.DeleteAsync(toDelete.Document.PublicId);
                if (deleteResponse.Error != null) return BadRequest(deleteResponse.Error.Message);
            }

            if (!string.IsNullOrEmpty(toDelete.Document.ThumbnailPublicId)) {
                DeletionResult thumbnailDeleteResponse = await cloudinaryService.DeleteAsync(toDelete.Document.ThumbnailPublicId);
                if (thumbnailDeleteResponse.Error != null) return BadRequest(thumbnailDeleteResponse.Error.Message);
            }
        }

        return await usersService.GenerateAccountDtoAsync(userId);
    }

    [Authorize]
    [HttpDelete("medical-insurance-company-document/{documentId}")]
    public async Task<ActionResult<AccountDto?>> DeleteInsuranceDocumentByIdAsync([FromRoute]int documentId)
    {
        int userId = User.GetUserId();

        AppUser? user = await userManager.Users
            .AsNoTracking()
            .Include(x => x.UserMedicalInsuranceCompanies)
                .ThenInclude(x => x.Document)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        if (!await uow.DocumentRepository.ExistsByIdAsync(documentId))
        return BadRequest($"El documento de la compañía de seguro médico con id {documentId} no existe.");

        if (!user.UserMedicalInsuranceCompanies.Any(x => x.DocumentId == documentId))
        return BadRequest($"No estás registrado con la compañía de seguro médico que tiene el documento con id {documentId}.");

        Document? document = await uow.DocumentRepository.GetByIdAsync(documentId);

        if (document == null) return NotFound($"No se ha encontrado el documento de la compañía de seguro médico con id {documentId}.");

        if (document != null) {
            if (!string.IsNullOrEmpty(document.PublicId)) {
                DeletionResult deleteResponse = await cloudinaryService.DeleteAsync(document.PublicId);
                if (deleteResponse.Error != null) return BadRequest(deleteResponse.Error.Message);
            }

            if (!string.IsNullOrEmpty(document.ThumbnailPublicId)) {
                DeletionResult thumbnailDeleteResponse = await cloudinaryService.DeleteAsync(document.ThumbnailPublicId);
                if (thumbnailDeleteResponse.Error != null) return BadRequest(thumbnailDeleteResponse.Error.Message);
            }
        }

        uow.DocumentRepository.Delete(document);

        if (!await uow.Complete()) return BadRequest("Error eliminando el documento de la compañía de seguro médico.");

        return await usersService.GenerateAccountDtoAsync(userId);
    }

    [Authorize]
    [HttpPut("medical-insurance-company/{medicalInsuranceCompanyId}")]
    public async Task<ActionResult> UpdateMedicalInsuranceCompany(int medicalInsuranceCompanyId, UserMedicalInsuranceCompanyUpdateDto request)
    {
        int userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.UserMedicalInsuranceCompanies)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        UserMedicalInsuranceCompany? medicalInsuranceCompany = user.UserMedicalInsuranceCompanies.SingleOrDefault(x => x.MedicalInsuranceCompanyId == medicalInsuranceCompanyId);
        if (medicalInsuranceCompany == null) return NotFound($"La compañía de seguro médico con id {medicalInsuranceCompanyId} no existe.");

        if (request.IsMain)
        {
            var mainMedicalInsuranceCompany = user.UserMedicalInsuranceCompanies.SingleOrDefault(x => x.IsMain);
            if (mainMedicalInsuranceCompany != null) mainMedicalInsuranceCompany.IsMain = false;
        }

        medicalInsuranceCompany.IsMain = request.IsMain;
        medicalInsuranceCompany.PolicyNumber = request.PolicyNumber;

        if (!uow.HasChanges()) return Ok();
        if (!await uow.Complete()) return BadRequest("Error actualizando la compañía de seguro médico.");

        return Ok();
    }

    [Authorize]
    [HttpGet("doctor-medical-insurance-companies")]
    public async Task<ActionResult<List<MedicalInsuranceCompanyDto>>> GetDoctorMedicalInsuranceCompanies()
    {
        int userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.DoctorMedicalInsuranceCompanies)
                .ThenInclude(x => x.MedicalInsuranceCompany)
                .ThenInclude(x => x.MedicalInsuranceCompanyPhoto)
                .ThenInclude(x => x.Photo)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        return mapper.Map<List<MedicalInsuranceCompanyDto>>(user.DoctorMedicalInsuranceCompanies.Select(x => x.MedicalInsuranceCompany).ToList());
    }

    [Authorize]
    [HttpPut("doctor-medical-insurance-company")]
    public async Task<ActionResult<AccountDto?>> ToggleDoctorInsuranceAsync([FromQuery]int insuranceId, [FromQuery]bool isActive)
    {
        int userId = User.GetUserId();

        AppUser? user = await userManager.Users
            .Include(x => x.DoctorMedicalInsuranceCompanies)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        if (!await uow.UserRepository.HasDoctorRoleByIdAsync(userId))
        return BadRequest($"El usuario con id {userId} no es un doctor.");

        if (!await uow.MedicalInsuranceCompanyRepository.ExistsByIdAsync(insuranceId))
        return BadRequest($"La compañía de seguro médico con id {insuranceId} no existe.");

        if (user.DoctorMedicalInsuranceCompanies.Any(x => x.MedicalInsuranceCompanyId == insuranceId))
        {
            DoctorMedicalInsuranceCompany? doctorMedicalInsuranceCompany = user.DoctorMedicalInsuranceCompanies.SingleOrDefault(x => x.MedicalInsuranceCompanyId == insuranceId);
            user.DoctorMedicalInsuranceCompanies.Remove(doctorMedicalInsuranceCompany);
        }
        else
        {
            user.DoctorMedicalInsuranceCompanies.Add(new(insuranceId));
        }

        if (!await uow.Complete()) return BadRequest("Error actualizando la compañía de seguro médico del doctor.");

        return await usersService.GenerateAccountDtoAsync(userId);
    }

    [Authorize]
    [HttpPut("email")]
    public async Task<ActionResult<AccountDto?>> UpdateEmail([FromBody] EmailUpdateDto request)
    {
        using var hmac = new HMACSHA512();

        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Email == User.GetEmail());

        if (user == null) return NotFound($"El usuario de correo {User.GetEmail()} no existe.");

        if (!userManager.CheckPasswordAsync(user, request.Password).Result) return BadRequest("La contraseña es incorrecta.");

        if (await userManager.FindByEmailAsync(request.Email) != null) return BadRequest("Ya existe una cuenta con este correo.");

        var result = await userManager.SetEmailAsync(user, request.Email);
        if (!result.Succeeded) return BadRequest("Error al actualizar correo.");

        var updateUsernameResult = await userManager.SetUserNameAsync(user, request.Email);
        if (!updateUsernameResult.Succeeded) return BadRequest("Error al actualizar nombre de usuario.");

        user.EmailConfirmed = false;

        string emailVerificationCode =  codeService.GenerateEmailCode();
        user.EmailVerificationCodeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(emailVerificationCode));
        user.EmailVerificationCodeSalt = hmac.Key;
        user.EmailVerificationExpiryTime = DateTime.UtcNow.AddMinutes(30);

        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded) return BadRequest("Error al actualizar información del usuario.");

        string clientUrl = clientSettings.Value.Url;
        string verifyEmailUrl = $"{clientUrl}/auth/verify-email?email={user.Email}";
        string subject = $"🔒 Mediverse: Verifica tu correo {user.FirstName}!";
        string htmlMessage =  emailService.CreateVerifyEmailAddressEmailForUpdate(user, emailVerificationCode);

        await emailService.SendMail(user.Email, subject, htmlMessage);

        var itemToReturn = await usersService.GenerateAccountDtoAsync(user.Id);

        return itemToReturn;
    }

    [Authorize]
    [HttpPut("password")]
    public async Task<ActionResult> UpdatePassword([FromBody] PasswordUpdateDto request)
    {
        if (request.NewPassword != request.ConfirmPassword) return BadRequest("Las contraseñas no coinciden.");

        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Email == User.GetEmail());

        if (user == null) return NotFound($"El usuario de correo {User.GetEmail()} no existe.");

        var result = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

        if (!result.Succeeded) return BadRequest("Error actualizando contraseña.");

        return Ok();
    }

    [Authorize]
    [HttpPut("account-details")]
    public async Task<ActionResult<AccountDto?>> UpdateAccountDetailsAsync([FromForm] IFormFile photo, [FromForm] IFormFile file, [FromForm] string json)
    {
        int userId = User.GetUserId();
        var roles = User.GetRoles();

        AccountDetailsUpdateDto? request = JsonSerializer.Deserialize<AccountDetailsUpdateDto>(json);

        if (request == null) return BadRequest("No se ha enviado la información del usuario.");

        AppUser? user = await userManager.Users
            .Include(x => x.UserPhoto)
                .ThenInclude(x => x.Photo)
            .Include(x => x.DoctorPaymentMethodTypes)
            .Include(x => x.UserMedicalLicenses)
                .ThenInclude(x => x.MedicalLicense)
                .ThenInclude(x => x.MedicalLicenseSpecialty)
            .Include(x => x.UserMedicalLicenses)
                .ThenInclude(x => x.MedicalLicense)
                .ThenInclude(x => x.MedicalLicenseDocument)
                .ThenInclude(x => x.Document)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        mapper.Map<AccountDetailsUpdateDto, AppUser>(request, user);

        // only if the claims principal has a role of doctor
        if (roles.Contains("Doctor"))
        {
            MedicalLicense? prevMedicalLicense = user.UserMedicalLicenses.FirstOrDefault(x => x.IsMain)?.MedicalLicense;
            if (prevMedicalLicense == null || prevMedicalLicense.MedicalLicenseSpecialty.SpecialtyId != int.Parse(request.SpecialtyId))
            {
                if (file == null || file.Length == 0) return BadRequest("No se ha enviado una prueba de especialidad.");

                if (await uow.SpecialtyRepository.GetByIdAsync(int.Parse(request.SpecialtyId)) == null)
                    return BadRequest($"La especialidad con id {request.SpecialtyId} no existe.");

                var uploadResult = await cloudinaryService.UploadAsync(file, new() {
                    File = new FileDescription(file.FileName, file.OpenReadStream()),
                    Folder = "Mediverse/DoctorMedicalLicenses",
                });
                if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);

                if (prevMedicalLicense != null)
                {
                    var deletionResult = await cloudinaryService.DeleteAsync(prevMedicalLicense.MedicalLicenseDocument.Document.PublicId);
                    if (deletionResult.Error != null)
                        return BadRequest("Error eliminando la prueba de especialidad anterior.");
                }

                user.UserMedicalLicenses.Clear();

                user.UserMedicalLicenses.Add(new (int.Parse(request.SpecialtyId), uploadResult.PublicId, uploadResult.SecureUrl.AbsoluteUri) { IsMain = true });
            }
            else
            {
                if (file != null && file.Length > 0)
                {
                    var medicalLicense = user.UserMedicalLicenses.FirstOrDefault(x => x.MedicalLicense.MedicalLicenseSpecialty.SpecialtyId == int.Parse(request.SpecialtyId));
                    if (medicalLicense == null) return BadRequest("No se ha encontrado la prueba de especialidad.");

                    var uploadResult = await cloudinaryService.UploadAsync(file, new() {
                        File = new FileDescription(file.FileName, file.OpenReadStream()),
                        Folder = "Mediverse/DoctorMedicalLicenses",
                    });
                    if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);

                    var previousMedicalLicenseDocument = medicalLicense.MedicalLicense.MedicalLicenseDocument;
                    var prevDocumentDeleteResult = await cloudinaryService.DeleteAsync(previousMedicalLicenseDocument.Document.PublicId);
                    if (prevDocumentDeleteResult.Error != null) return BadRequest("Error eliminando la prueba de especialidad anterior.");

                    medicalLicense.MedicalLicense.MedicalLicenseDocument = new(uploadResult.PublicId, uploadResult.SecureUrl.AbsoluteUri);
                }
            }

            if (!string.IsNullOrEmpty(request.AcceptedPaymentMethods))
            {
                List<int> acceptedPaymentMethods = request.AcceptedPaymentMethods.Split(',').Select(int.Parse).ToList();
                var userPaymentMethodTypes = user.DoctorPaymentMethodTypes.Select(x => x.PaymentMethodTypeId).ToList();
                if (!userPaymentMethodTypes.All(acceptedPaymentMethods.Contains) || !acceptedPaymentMethods.All(userPaymentMethodTypes.Contains)) {
                    user.DoctorPaymentMethodTypes.Clear();

                    foreach (var paymentMethodTypeId in acceptedPaymentMethods)
                    {
                        var paymentMethodType = new DoctorPaymentMethodType
                        {
                            DoctorId = user.Id,
                            PaymentMethodTypeId = paymentMethodTypeId
                        };
                        user.DoctorPaymentMethodTypes.Add(paymentMethodType);
                    }
                }
            }
        }

        if (user.UserPhoto != null)
        {
            if (request.RemoveAvatar) {
                if (!await photosService.DeleteAsync(user.UserPhoto.Photo)) return BadRequest("Error eliminando la foto.");
            }
        } else {
            if (photo != null)
            {
                ImageUploadParams imageUploadParams = new() {
                    File = new FileDescription(photo.FileName, photo.OpenReadStream()),
                    Folder = "Mediverse/UserPhoto",
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face"),
                };

                var result = await cloudinaryService.UploadAsync(photo, imageUploadParams);

                if (result.Error != null) return BadRequest(result.Error.Message);

                if (user.UserPhoto != null)
                {
                    if (!await photosService.DeleteAsync(user.UserPhoto.Photo))
                        return BadRequest("Error eliminando la foto anterior.");
                }

                Photo newPhoto = new(result, userId);

                uow.PhotoRepository.Add(newPhoto);
            }
        }

        if (uow.HasChanges()) {
            if (!await uow.Complete()) return BadRequest("Error actualizando la información del usuario.");
        }

        var itemToReturn = await usersService.GenerateAccountDtoAsync(userId);

        return itemToReturn;
    }

    [Authorize]
    [HttpPost("work-schedule")]
    public async Task<ActionResult<AccountDto?>> UpdateWorkScheduleAsync([FromBody] WorkScheduleUpdateDto request)
    {
        int userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.DoctorWorkSchedules)
                .ThenInclude(x => x.WorkSchedule)
            .Include(x => x.DoctorWorkScheduleSettings)
                .ThenInclude(x => x.WorkScheduleSettings)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        var workSchedulesToDelete = user.DoctorWorkSchedules.ToList();
        foreach (var workSchedule in workSchedulesToDelete)
        {
            await uow.UserRepository.DeleteDoctorWorkScheduleAsync(workSchedule.WorkSchedule);
            user.DoctorWorkSchedules.Remove(workSchedule);
        }

        if (request.WorkScheduleBlocks != null && request.WorkScheduleBlocks.Count > 0)
        {
            foreach (var block in request.WorkScheduleBlocks)
            {
                var parts = block.Split("-");
                if (parts.Length != 3) continue;

                if (TimeOnly.TryParse(parts[0], out var startTime) &&
                    TimeOnly.TryParse(parts[1], out var endTime) &&
                    int.TryParse(parts[2], out var dayOfWeek))
                {
                    user.DoctorWorkSchedules.Add(new() {
                        UserId = userId,
                        WorkSchedule = new() {
                            StartTime = startTime,
                            EndTime = endTime,
                            DayOfWeek = dayOfWeek
                        }
                    });
                }
            }
            if (!await uow.Complete()) return BadRequest("Error actualizando los horarios de trabajo.");
        }

        if (request.StartTime != null && request.EndTime != null && request.MinutesPerBlock != 0)
        {
            if (user.DoctorWorkScheduleSettings != null)
            {
                await uow.UserRepository.DeleteDoctorWorkScheduleSettingsAsync(user.DoctorWorkScheduleSettings.WorkScheduleSettings);
                user.DoctorWorkScheduleSettings = null;
            }

            WorkScheduleSettings workScheduleSettings = new()
            {
                StartTime = TimeOnly.Parse(request.StartTime).ToTimeSpan(),
                EndTime = TimeOnly.Parse(request.EndTime).ToTimeSpan(),
                MinutesPerBlock = request.MinutesPerBlock
            };

            user.DoctorWorkScheduleSettings = new()
            {
                UserId = userId,
                WorkScheduleSettings = workScheduleSettings
            };
        }

        if (uow.HasChanges())
        {
            if (!await uow.Complete()) return BadRequest("Error actualizando los horarios de trabajo.");
        }

        var itemToReturn = await usersService.GenerateAccountDtoAsync(userId);

        return itemToReturn;
    }

    [Authorize]
    [HttpGet("medical-record")]
    public async Task<ActionResult<MedicalRecordDto>> GetMedicalRecord()
    {
        int userId = User.GetUserId();

        var itemToReturn = await uow.UserRepository.GetMedicalRecordDtoAsync(userId);

        return itemToReturn;
    }

    [Authorize]
    [HttpPut("medical-record")]
    public async Task<ActionResult<MedicalRecordDto>> UpdateMedicalRecord([FromBody] MedicalRecordUpdateDto request)
    {
        int userId = User.GetUserId();

        AppUser? user = await userManager.Users
            .Include(u => u.UserMedicalRecord.MedicalRecord.MedicalRecordFamilyMembers)
                .ThenInclude(mrfm => mrfm.FamilyMember.MedicalRecordFamilyMemberRelativeType)
            .Include(u => u.UserMedicalRecord.MedicalRecord.MedicalRecordPersonalDiseases)
            .Include(u => u.UserMedicalRecord.MedicalRecord.MedicalRecordSubstances)
            .Include(u => u.UserMedicalRecord.MedicalRecord.MedicalRecordFamilyDiseases)
            .Include(u => u.UserMedicalRecord.MedicalRecord.MedicalRecordCompanion.Companion.CompanionRelativeType.RelativeType)
            .Include(u => u.UserMedicalRecord.MedicalRecord.MedicalRecordOccupation.Occupation)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        if (user.UserMedicalRecord != null)
        {
            var existingUserMedicalRecord = user.UserMedicalRecord;

            await uow.UserRepository.DeleteMedicalRecordAsync(existingUserMedicalRecord);
        }

        MedicalRecord itemToCreate = new();

        itemToCreate.PatientName = request.PatientName!;
        itemToCreate.Age = request.Age ?? 0;
        itemToCreate.Sex = request.Sex?.Code ?? string.Empty;
        itemToCreate.BirthPlace = string.IsNullOrEmpty(request.BirthPlace) ? string.Empty : request.BirthPlace;
        itemToCreate.BirthDate = request.BirthDate ?? DateTime.MinValue;
        itemToCreate.YearsOfSchooling = request.YearsOfSchooling ?? 0;
        itemToCreate.HandDominance = request.HandDominance?.Code ?? string.Empty;
        itemToCreate.CurrentLivingSituation = request.CurrentLivingSituation ?? string.Empty;
        itemToCreate.CurrentAddress = request.CurrentAddress ?? string.Empty;
        itemToCreate.HomePhone = request.HomePhone;
        itemToCreate.MobilePhone = request.MobilePhone ?? string.Empty;
        itemToCreate.Email = request.Email ?? string.Empty;
        itemToCreate.HasCompanion = request.HasCompanion ?? false;
        itemToCreate.EconomicDependence = request.EconomicDependence ?? string.Empty;
        itemToCreate.UsesGlassesOrHearingAid = request.UsesGlassesOrHearingAid ?? false;
        itemToCreate.Comments = request.Comments;

        if (request.EducationLevel != null && request.EducationLevel.Id.HasValue) 
            itemToCreate.MedicalRecordEducationLevel = new(request.EducationLevel.Id.Value);

        if (request.ColorBlindness != null && request.ColorBlindness.Id.HasValue) 
            itemToCreate.MedicalRecordColorBlindness = new(request.ColorBlindness.Id.Value);

        if (request.Occupation != null && request.Occupation.Id.HasValue) 
            itemToCreate.MedicalRecordOccupation = new(request.Occupation.Id.Value);

        if (request.MaritalStatus != null && request.MaritalStatus.Id.HasValue) 
            itemToCreate.MedicalRecordMaritalStatus = new(request.MaritalStatus.Id.Value);

        if (request.HasCompanion.HasValue && request.HasCompanion.Value == true && request?.Companion == null)
        return BadRequest("Si el paciente asiste solo, debe proporcionar información del acompañante.");

        if (request?.Companion != null && request.HasCompanion.HasValue && request.HasCompanion.Value == true) {
            Companion companion = new();

            if (!string.IsNullOrEmpty(request.Companion.Name)) companion.Name = request.Companion.Name;
            if (request.Companion.Age.HasValue) companion.Age = request.Companion.Age.Value;
            if (!string.IsNullOrEmpty(request.Companion.Sex?.Code)) companion.Sex = request.Sex?.Code;
            if (!string.IsNullOrEmpty(request.Companion.Address)) companion.Address = request.Companion.Address;
            if (!string.IsNullOrEmpty(request.Companion.HomePhone)) companion.HomePhone = request.Companion.HomePhone;
            if (!string.IsNullOrEmpty(request.Companion.PhoneNumber)) companion.PhoneNumber = request.Companion.PhoneNumber;
            if (!string.IsNullOrEmpty(request.Companion.Email)) companion.Email = request.Companion.Email;
            if (request.Companion.Occupation != null && request.Companion.Occupation.Id.HasValue) companion.CompanionOccupation = new(request.Companion.Occupation.Id.Value);
            if (request.Companion.RelativeType != null && request.Companion.RelativeType.Id.HasValue) companion.CompanionRelativeType = new(request.Companion.RelativeType.Id.Value);

            itemToCreate.MedicalRecordCompanion = new() { Companion = companion };
        }

        if (
            request?.FamilyMembers.Count() > 0 && 
            request.FamilyMembers[0].Name != null &&
            request.FamilyMembers[0].Age != null &&
            request.FamilyMembers[0].RelativeType != null
        ) {

        List<MedicalRecordFamilyMember> medicalRecordFamilyMembers = [];
        for (int i = 0; i < request.FamilyMembers.Count(); i++) {
                MedicalRecordUpdateFamilyMemberDto? fm = request.FamilyMembers[i];
                if (fm == null) continue;

                MedicalRecordFamilyMember medicalRecordFamilyMemberToCreate = new() { FamilyMember = new() };

                if (!string.IsNullOrEmpty(fm.Name)) medicalRecordFamilyMemberToCreate.FamilyMember.Name = fm.Name;
                if (fm.Age.HasValue) medicalRecordFamilyMemberToCreate.FamilyMember.Age = fm.Age.Value;
                if (fm.RelativeType != null && fm.RelativeType.Id.HasValue) medicalRecordFamilyMemberToCreate.FamilyMember.MedicalRecordFamilyMemberRelativeType = new(fm.RelativeType.Id.Value);

                medicalRecordFamilyMembers.Add(medicalRecordFamilyMemberToCreate);
            }

            itemToCreate.MedicalRecordFamilyMembers = medicalRecordFamilyMembers;
        }

        if (
            request?.PersonalMedicalHistory.Count() > 0 && 
            request.PersonalMedicalHistory[0].Disease != null
        ) {

            List<MedicalRecordPersonalDisease> medicalRecordPersonalDiseases = new();
            for (int i = 0; i < request.PersonalMedicalHistory.Count(); i++) {
                MedicalRecordUpdatePersonalDiseaseDto? pd = request.PersonalMedicalHistory[i];
                if (pd == null) continue;

                MedicalRecordPersonalDisease medicalRecordPersonalDiseaseToCreate = new();

                if (!string.IsNullOrEmpty(pd.Description)) medicalRecordPersonalDiseaseToCreate.Description = pd.Description;
                if (pd.Disease != null && pd.Disease.Id.HasValue) medicalRecordPersonalDiseaseToCreate.DiseaseId = pd.Disease.Id.Value;

                medicalRecordPersonalDiseases.Add(medicalRecordPersonalDiseaseToCreate);
            }

            itemToCreate.MedicalRecordPersonalDiseases = medicalRecordPersonalDiseases;
        }


        if (
            request?.PersonalDrugHistory.Count() > 0 &&
            request.PersonalDrugHistory[0].Substance != null &&
            request.PersonalDrugHistory[0].ConsumptionLevel != null
        ) {

            List<MedicalRecordSubstance> medicalRecordSubstances = [];
            for(int i = 0; i < request.PersonalDrugHistory.Count(); i++) {
                MedicalRecordUpdatePersonalSubstanceDto? ps = request.PersonalDrugHistory[i];
                if (ps.Substance == null) continue;

                MedicalRecordSubstance medicalRecordSubstanceToCreate = new();

                if (ps.Substance != null) medicalRecordSubstanceToCreate.SubstanceId = ps.Substance.Id;
                if (ps.ConsumptionLevel != null) medicalRecordSubstanceToCreate.ConsumptionLevelId = ps.ConsumptionLevel.Id;
                if (ps.StartAge.HasValue) medicalRecordSubstanceToCreate.StartAge = ps.StartAge.Value;
                if (ps.EndAge.HasValue) medicalRecordSubstanceToCreate.EndAge = ps.EndAge.Value;
                if (ps.IsCurrent.HasValue) medicalRecordSubstanceToCreate.IsCurrent = ps.IsCurrent.Value;
                if (!string.IsNullOrEmpty(ps.Other)) medicalRecordSubstanceToCreate.Other = ps.Other;

                medicalRecordSubstances.Add(medicalRecordSubstanceToCreate);
            }

            itemToCreate.MedicalRecordSubstances = medicalRecordSubstances;
        }

        if (
            request?.FamilyMedicalHistory.Count() > 0 &&
            request.FamilyMedicalHistory[0].Disease != null &&
            request.FamilyMedicalHistory[0].RelativeType != null
        ) {

            List<MedicalRecordFamilyDisease> medicalRecordFamilyDiseases = [];
            for (int i = 0; i < request.FamilyMedicalHistory.Count(); i++) {
                MedicalRecordUpdateFamilyDiseaseDto? fd = request.FamilyMedicalHistory[i];
                if (fd == null) continue;

                MedicalRecordFamilyDisease medicalRecordFamilyDiseaseToCreate = new();

                if (fd.Disease != null) medicalRecordFamilyDiseaseToCreate.DiseaseId = fd.Disease.Id;
                if (fd.RelativeType != null && fd.RelativeType.Id.HasValue) medicalRecordFamilyDiseaseToCreate.RelativeTypeId = fd.RelativeType.Id.Value;

                medicalRecordFamilyDiseases.Add(medicalRecordFamilyDiseaseToCreate);
            }

            itemToCreate.MedicalRecordFamilyDiseases = medicalRecordFamilyDiseases;
        }

        user.UserMedicalRecord = new UserMedicalRecord();
        user.UserMedicalRecord.MedicalRecord = itemToCreate;

        if (uow.HasChanges()) {
            if (!await uow.Complete()) return BadRequest("Error actualizando el historial clínico.");
        }

        var itemToReturn = await uow.UserRepository.GetMedicalRecordDtoAsync(userId);

        return itemToReturn;
    }

    [Authorize]
    [HttpGet("satisfaction-surveys")]
    public async Task<ActionResult<List<SatisfactionSurveyDto>>> GetSatisfactionSurveys()
    {
        int userId = User.GetUserId();

        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Id == userId);
        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        var events = await uow.EventRepository.GetPendingSatisfactionSurveysAsync(userId);

        return mapper.Map<List<SatisfactionSurveyDto>>(events);
    }

    [Authorize]
    [HttpPost("review")]
    public async Task<ActionResult> SubmitReview([FromBody] ReviewCreateDto request)
    {
        int userId = User.GetUserId();

        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Id == userId);
        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        Event patientEvent = await uow.EventRepository.GetByIdAsync(request.EventId);
        if (patientEvent == null) return NotFound($"El evento con id {request.EventId} no existe.");

        patientEvent.IsServiceRecommended = request.IsServiceRecommended;

        var review = new Review
        {
            Rating = request.Rating,
            Content = request.Comment,
            DoctorReview = new() {
                DoctorId = patientEvent.DoctorEvent.Doctor.Id,
            },
            UserReview = new() {
                UserId = userId,
            }
        };

        patientEvent.IsSatisfactionSurveyCompleted = true;

        await uow.UserRepository.AddReviewAsync(review);

        if (uow.HasChanges()) {
            if (!await uow.Complete()) return BadRequest("Error creando la revisión.");
        }

        return Ok();
    }

    [Authorize]
    [HttpPost("review/skip/{eventId}")]
    public async Task<ActionResult> SkipReview([FromRoute] int eventId)
    {
        int userId = User.GetUserId();

        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Id == userId);
        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        Event patientEvent = await uow.EventRepository.GetByIdAsync(eventId);
        if (patientEvent == null) return NotFound($"El evento con id {eventId} no existe.");

        patientEvent.IsSatisfactionSurveyCompleted = true;

        if (uow.HasChanges()) {
            if (!await uow.Complete()) return BadRequest("Error omitiendo la revisión.");
        }

        return Ok();
    }
}
