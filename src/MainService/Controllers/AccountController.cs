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
using MainService.Core.DTOs.MedicalRecord;
using MainService.Models.Entities.Aggregate;
using Serilog;

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
    IStripeService stripeService,
    IMedicalRecordsService medicalRecordsService
) : BaseApiController
{
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<AccountDto?>> GetAccountAsync() =>
        await usersService.GenerateAccountDtoAsync(User.GetUserId());

    [HttpPost("login")]
    public async Task<ActionResult<AccountDto?>> LoginAsync([FromBody] LoginDto request)
    {
        if (string.IsNullOrEmpty(request.Email)) return BadRequest("No se ha proporcionado un correo.");
        if (string.IsNullOrEmpty(request.Password)) return BadRequest("No se ha proporcionado una contraseña.");

        var user = await userManager.FindByEmailAsync(request.Email);

        if (user == null) return Unauthorized("Correo o contraseña incorrectos.");

        var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, false);

        if (!result.Succeeded) return Unauthorized("Correo o contraseña incorrectos.");

        if (user.TwoFactorEnabled)
        {
            return Ok(new { RequiresTwoFactor = true });
        }

        var itemToReturn = await usersService.GenerateAccountDtoAsync(user.Id);

        return itemToReturn;
    }

    [Authorize]
    [HttpGet("current")]
    public async Task<ActionResult<AccountDto?>> GetCurrentUserAsync() =>
        await usersService.GenerateAccountDtoAsync(User.GetUserId());

    [HttpPost("login-two-factor")]
    public async Task<ActionResult<AccountDto>> LoginTwoFactorAsync([FromBody] TwoFactorLoginDto request)
    {
        if (string.IsNullOrEmpty(request.Email)) return BadRequest("No se ha proporcionado un correo.");
        if (string.IsNullOrEmpty(request.VerificationCode))
            return BadRequest("No se ha proporcionado un código de verificación.");

        var user = await userManager.FindByEmailAsync(request.Email);

        if (user == null) return Unauthorized("No se ha encontrado al usuario.");

        var validVerification = await userManager.VerifyTwoFactorTokenAsync(user,
            userManager.Options.Tokens.AuthenticatorTokenProvider, request.VerificationCode);

        if (!validVerification) return Unauthorized("Código de verificación incorrecto.");

        var itemToReturn = await usersService.GenerateAccountDtoAsync(user.Id);

        itemToReturn!.Token = await tokenService.CreateToken(user);

        return itemToReturn;
    }

    [HttpPost("login-social")]
    public async Task<ActionResult<AccountDto?>> LoginSocialAsync([FromBody] SocialAuthDto request)
    {
        if (string.IsNullOrEmpty(request.AccessToken)) return BadRequest("No se ha proporcionado un token de acceso.");
        if (string.IsNullOrEmpty(request.Provider)) return BadRequest("No se ha proporcionado un proveedor.");

        var payload = await googleService.VerifyGoogleTokenAsync(request.AccessToken);

        if (payload == null) return Unauthorized("Token inválido.");

        UserLoginInfo info = new(request.Provider, payload.Subject, request.Provider);

        var user = await userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
        if (user == null)
        {
            user = await userManager.FindByEmailAsync(payload.Email);

            if (user == null)
            {
                var newUser = mapper.Map<AppUser>(payload);

                newUser.UserPhoto = new UserPhoto { Photo = new Photo { Url = new Uri(payload.Picture) } };

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
        if (string.IsNullOrEmpty(request.AccessToken)) return BadRequest("No se ha proporcionado un token de acceso.");
        if (string.IsNullOrEmpty(request.Provider)) return BadRequest("No se ha proporcionado un proveedor.");

        var payload = await googleService.VerifyGoogleTokenAsync(request.AccessToken);

        if (payload == null) return Unauthorized("Token inválido.");

        UserLoginInfo info = new(request.Provider, payload.Subject, request.Provider);

        var email = User.GetEmail();

        if (string.IsNullOrEmpty(email)) return BadRequest("No se ha proporcionado un correo.");

        if (email != payload.Email) return BadRequest("El correo no coincide con el de la cuenta.");

        var user = await userManager.FindByEmailAsync(email);

        if (user == null) return NotFound("No se ha encontrado al usuario.");

        var loginExists = await userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
        if (loginExists != null) return BadRequest("Ya existe una cuenta con este proveedor.");

        await userManager.AddLoginAsync(user, info);

        return Ok();
    }

    [HttpPost("register")]
    public async Task<ActionResult<AccountDto?>> RegisterAsync([FromBody] RegisterDto request)
    {
        if (string.IsNullOrEmpty(request.FirstName)) return BadRequest("No se ha proporcionado un nombre.");
        if (string.IsNullOrEmpty(request.LastName)) return BadRequest("No se ha proporcionado un apellido.");
        if (string.IsNullOrEmpty(request.Gender)) return BadRequest("No se ha proporcionado un género.");
        if (string.IsNullOrEmpty(request.Email)) return BadRequest("No se ha proporcionado un correo.");
        if (!request.DateOfBirth.HasValue) return BadRequest("No se ha proporcionado una fecha de nacimiento.");
        if (string.IsNullOrEmpty(request.Password)) return BadRequest("No se ha proporcionado una contraseña.");
        if (string.IsNullOrEmpty(request.ConfirmPassword))
            return BadRequest("No se ha proporcionado una contraseña de confirmación.");
        if (!request.AgreeTerms.HasValue) return BadRequest("No se ha aceptado los términos y condiciones.");

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

        var emailVerificationCode = codeService.GenerateEmailCode();

        user.EmailVerificationCodeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(emailVerificationCode));
        user.EmailVerificationCodeSalt = hmac.Key;
        user.EmailVerificationExpiryTime = DateTime.UtcNow.AddMinutes(30);

        if (!(await userManager.UpdateAsync(user)).Succeeded)
            return BadRequest("No pudo actualizarse la información del usuario.");

        var clientUrl = clientSettings.Value.Url;
        var verifyEmailUrl = $"{clientUrl}/auth/verify-email?email={user.Email}";
        var subject = $"🔒 DocHub: Verifica tu correo {user.FirstName}!";
        var htmlMessage =
            emailService.CreateVerifyEmailAddressEmailForRegister(user, verifyEmailUrl, emailVerificationCode);

        var email = user.Email;

        if (!string.IsNullOrEmpty(email))
        {
            await emailService.SendMail(email, subject, htmlMessage);
        }

        return await usersService.GenerateAccountDtoAsync(user.Id);
    }

    [HttpPost("register-doctor")]
    public async Task<ActionResult<AccountDto?>> RegisterDoctorAsync([FromForm] IFormFile file, [FromForm] string json)
    {
        if (file == null || file.Length == 0) return BadRequest("No se ha enviado una prueba de especialidad.");

        var request = JsonSerializer.Deserialize<DoctorRegisterDto>(json);

        if (request == null) return BadRequest("Error al registrar al doctor.");

        if (string.IsNullOrEmpty(request.Email)) return BadRequest("No se ha proporcionado un correo.");
        if (string.IsNullOrEmpty(request.FirstName)) return BadRequest("No se ha proporcionado un nombre.");
        if (string.IsNullOrEmpty(request.LastName)) return BadRequest("No se ha proporcionado un apellido.");
        if (string.IsNullOrEmpty(request.Gender)) return BadRequest("No se ha proporcionado un género.");
        if (!request.DateOfBirth.HasValue) return BadRequest("No se ha proporcionado una fecha de nacimiento.");
        if (string.IsNullOrEmpty(request.Password)) return BadRequest("No se ha proporcionado una contraseña.");
        if (string.IsNullOrEmpty(request.ConfirmPassword))
            return BadRequest("No se ha proporcionado una contraseña de confirmación.");
        if (!request.AgreeTerms.HasValue) return BadRequest("No se ha aceptado los términos y condiciones.");
        if (string.IsNullOrEmpty(request.Phone)) return BadRequest("No se ha proporcionado un número de teléfono.");
        if (string.IsNullOrEmpty(request.State)) return BadRequest("No se ha proporcionado un estado.");
        if (string.IsNullOrEmpty(request.City)) return BadRequest("No se ha proporcionado una ciudad.");
        if (string.IsNullOrEmpty(request.Street)) return BadRequest("No se ha proporcionado una calle.");
        if (string.IsNullOrEmpty(request.Zipcode)) return BadRequest("No se ha proporcionado un código postal.");
        if (string.IsNullOrEmpty(request.Neighborhood)) return BadRequest("No se ha proporcionado una colonia.");
        if (string.IsNullOrEmpty(request.ExteriorNumber))
            return BadRequest("No se ha proporcionado un número exterior.");
        if (string.IsNullOrEmpty(request.SpecialtyId)) return BadRequest("No se ha proporcionado una especialidad.");
        if (string.IsNullOrEmpty(request.AcceptedPaymentMethods))
            return BadRequest("No se han proporcionado métodos de pago aceptados.");
        if (!request.RequireAnticipatedCardPayments.HasValue)
            return BadRequest("No se ha especificado si se requieren pagos anticipados con tarjeta.");
        if (!request.SameAddress.HasValue)
            return BadRequest("No se ha especificado si la dirección de facturación es la misma que la principal.");
        if (string.IsNullOrEmpty(request.BillingState))
            return BadRequest("No se ha proporcionado un estado de facturación.");
        if (string.IsNullOrEmpty(request.BillingCity))
            return BadRequest("No se ha proporcionado una ciudad de facturación.");
        if (string.IsNullOrEmpty(request.BillingAddress))
            return BadRequest("No se ha proporcionado una dirección de facturación.");
        if (string.IsNullOrEmpty(request.BillingZipcode))
            return BadRequest("No se ha proporcionado un código postal de facturación.");
        if (string.IsNullOrEmpty(request.BillingNeighborhood))
            return BadRequest("No se ha proporcionado una colonia de facturación.");
        if (string.IsNullOrEmpty(request.BillingExteriorNumber))
            return BadRequest("No se ha proporcionado un número exterior de facturación.");
        if (string.IsNullOrEmpty(request.DisplayName))
            return BadRequest("No se ha proporcionado un nombre de visualización.");
        if (string.IsNullOrEmpty(request.StripePaymentMethodId))
            return BadRequest("No se ha proporcionado un id de método de pago de Stripe.");
        if (string.IsNullOrEmpty(request.Last4))
            return BadRequest("No se ha proporcionado los últimos 4 dígitos de la tarjeta.");
        if (!request.ExpirationMonth.HasValue)
            return BadRequest("No se ha proporcionado el mes de expiración de la tarjeta.");
        if (!request.ExpirationYear.HasValue)
            return BadRequest("No se ha proporcionado el año de expiración de la tarjeta.");
        if (string.IsNullOrEmpty(request.Brand)) return BadRequest("No se ha proporcionado la marca de la tarjeta.");
        if (string.IsNullOrEmpty(request.Country)) return BadRequest("No se ha proporcionado el país de la tarjeta.");

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
            IsBilling = request.SameAddress.Value ? true : false
        };

        var (latitude, longitude) =
            await googleService.GetAddressCoordinatesAsync(googleService.GetAddressText(mainAddress.Address));
        mainAddress.Address.Latitude = latitude;
        mainAddress.Address.Longitude = longitude;

        user.UserAddresses.Add(mainAddress);
        user.DoctorClinics.Add(new DoctorClinic { Clinic = mainAddress.Address, IsMain = true });

        if (!request.SameAddress.Value)
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
            (latitude, longitude) =
                await googleService.GetAddressCoordinatesAsync(googleService.GetAddressText(billingAddress.Address));
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

        var acceptedPaymentMethods = request.AcceptedPaymentMethods.Split(',').Select(int.Parse).ToList();
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

        var uploadResult = await cloudinaryService.UploadAsync(file, new ImageUploadParams
        {
            File = new FileDescription(file.FileName, file.OpenReadStream()),
            Folder = "Mediverse/DoctorMedicalLicenses",
        });
        if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);

        user.UserMedicalLicenses.Add(new UserMedicalLicense(int.Parse(request.SpecialtyId), uploadResult.PublicId,
            uploadResult.SecureUrl.AbsoluteUri) { IsMain = true });

        var email = user.Email;

        if (string.IsNullOrEmpty(email)) return BadRequest("No se ha proporcionado un correo.");

        var customerId = await stripeService.CreateCustomerAsync(email, user.FirstName + " " + user.LastName,
            request.StripePaymentMethodId);
        user.StripeCustomerId = customerId;

        var emailVerificationCode = codeService.GenerateEmailCode();

        user.EmailVerificationCodeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(emailVerificationCode));
        user.EmailVerificationCodeSalt = hmac.Key;
        user.EmailVerificationExpiryTime = DateTime.UtcNow.AddMinutes(30);

        if (!(await userManager.UpdateAsync(user)).Succeeded)
            return BadRequest("No pudo actualizarse la información del usuario.");

        var clientUrl = clientSettings.Value.Url;
        var verifyEmailUrl = $"{clientUrl}/auth/verify-email?email={user.Email}";
        var subject = $"🔒 DocHub: Verifica tu correo {user.FirstName}!";
        var htmlMessage =
            emailService.CreateVerifyEmailAddressEmailForRegister(user, verifyEmailUrl, emailVerificationCode);

        await emailService.SendMail(email, subject, htmlMessage);

        return await usersService.GenerateAccountDtoAsync(user.Id);
    }

    [Authorize]
    [HttpGet("two-factor-setup")]
    public async Task<ActionResult<TwoFactorSetupDto>> GetTwoFactorSetupAsync()
    {
        var userId = User.GetUserId();

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
        if (string.IsNullOrEmpty(request.VerificationCode))
            return BadRequest("El código de verificación es requerido.");

        var userId = User.GetUserId();

        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        var isTokenValid = await userManager.VerifyTwoFactorTokenAsync(user,
            userManager.Options.Tokens.AuthenticatorTokenProvider, request.VerificationCode);

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
        var userId = User.GetUserId();

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
    public async Task<ActionResult<AccountDto?>> UpdateAsync([FromBody] UserUpdateDto request)
    {
        var id = User.GetUserId();

        var item = await userManager.Users.SingleOrDefaultAsync(x => x.Id == id);

        if (item != null)
        {
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
        var userId = User.GetUserId();

        ImageUploadParams imageUploadParams = new()
        {
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
        var userId = User.GetUserId();

        var item = await userManager.Users
            .Include(x => x.UserPhoto)
            .ThenInclude(x => x.Photo)
            .SingleOrDefaultAsync(x => x.Id == userId);

        var photo = item?.UserPhoto?.Photo;

        if (photo == null) return BadRequest("No tienes foto de perfil.");

        if (!await photosService.DeleteAsync(photo)) return BadRequest("Error eliminando la foto.");

        var accountDto = await usersService.GenerateAccountDtoAsync(userId);

        return accountDto;
    }

    [Authorize]
    [HttpPut("doctor-banner")]
    public async Task<ActionResult<AccountDto?>> SetDoctorBannerPhotoAsync(IFormFile file)
    {
        var userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .Include(x => x.DoctorBannerPhoto)
            .ThenInclude(x => x.Photo)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");
        if (!user.UserRoles.Any(x => x.Role.Name == "Doctor"))
            return BadRequest("No tienes permisos para realizar esta acción.");

        var bannerPhoto = user.DoctorBannerPhoto?.Photo;
        if (bannerPhoto != null)
        {
            if (!await photosService.DeleteAsync(bannerPhoto))
                return BadRequest("Error eliminando la foto de portada.");
        }

        ImageUploadParams imageUploadParams = new()
        {
            File = new FileDescription(file.FileName, file.OpenReadStream()),
            Folder = "Mediverse/DoctorBannerPhoto",
        };

        var result = await cloudinaryService.UploadAsync(file, imageUploadParams);

        if (result.Error != null) return BadRequest(result.Error.Message);

        user.DoctorBannerPhoto = new DoctorBannerPhoto
        {
            Photo = new Photo { Url = result.SecureUrl, PublicId = result.PublicId },
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

        var rawToken = await userManager.GeneratePasswordResetTokenAsync(user);
        var resetToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(rawToken));
        var clientUrl = clientSettings.Value.Url;
        var resetUrl =
            $"{clientUrl}/auth/sign-in/new-password?resetToken={resetToken}&firstName={user.FirstName}&email={user.Email}";

        var subject = $"🚨 ¡Recupera tu contraseña, {user.FirstName}! 🔒";

        var htmlMessage = emailService.CreateResetPasswordEmail(user, resetUrl);

        await emailService.SendMail(email, subject, htmlMessage);

        var accountToReturn = mapper.Map<AppUser, AccountDto>(user);

        return accountToReturn;
    }

    [HttpPut("reset-password-with-token")]
    public async Task<ActionResult> ResetPasswordWithToken([FromBody] PasswordResetDto request)
    {
        if (string.IsNullOrEmpty(request.Email)) return BadRequest("El correo es requerido.");
        if (string.IsNullOrEmpty(request.Token)) return BadRequest("El token es requerido.");
        if (string.IsNullOrEmpty(request.Password)) return BadRequest("La contraseña es requerida.");

        var decodedToken = WebEncoders.Base64UrlDecode(request.Token);
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null) return NotFound($"El usuario de correo {request.Email} no existe.");

        if (!string.IsNullOrEmpty(user.PasswordHash))
        {
            var verifyPassResult =
                userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
            if (verifyPassResult == PasswordVerificationResult.Success)
                return BadRequest("La nueva contraseña debe ser distinta a la anterior.");

            var result =
                await userManager.ResetPasswordAsync(user, Encoding.UTF8.GetString(decodedToken), request.Password);

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
        if (string.IsNullOrEmpty(request.Password)) return BadRequest("La contraseña es requerida.");
        if (string.IsNullOrEmpty(request.ConfirmPassword))
            return BadRequest("La contraseña de confirmación es requerida.");

        if (request.Password != request.ConfirmPassword) return BadRequest("Las contraseñas no coinciden.");

        var user = await userManager.Users.SingleOrDefaultAsync(u => u.Email == User.GetEmail());

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
        if (string.IsNullOrEmpty(request.CurrentPassword)) return BadRequest("La contraseña actual es requerida.");
        if (string.IsNullOrEmpty(request.NewPassword)) return BadRequest("La nueva contraseña es requerida.");
        if (string.IsNullOrEmpty(request.ConfirmNewPassword))
            return BadRequest("La contraseña de confirmación es requerida.");

        var user = await userManager.Users.SingleOrDefaultAsync(u => u.Email == User.GetEmail());

        if (user == null) return NotFound($"El usuario de correo {User.GetEmail()} no existe.");

        var result = await signInManager.CheckPasswordSignInAsync(user, request.CurrentPassword, false);

        if (!result.Succeeded) return Unauthorized("La contraseña actual es incorrecta.");

        var token = await userManager.GeneratePasswordResetTokenAsync(user);

        var identityResult = await userManager.ResetPasswordAsync(user, token, request.NewPassword);

        if (!identityResult.Succeeded) return BadRequest("Error restableciendo contraseña.");

        return Ok();
    }

    [HttpPost("email-verification")]
    public async Task<ActionResult<AccountDto?>> EmailVerificationCode([FromBody] EmailVerificationDto request)
    {
        if (string.IsNullOrEmpty(request.Email)) return BadRequest("No se ha proporcionado un correo.");
        if (string.IsNullOrEmpty(request.Code)) return BadRequest("No se ha proporcionado un código.");

        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Email == request.Email);

        if (user == null) return NotFound($"El usuario de correo {request.Email} no existe.");

        if (user.EmailConfirmed) return BadRequest("Este correo ya se encuentra verificado.");

        var result = codeService.ValidateEmailCode(user, request.Code);

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

        var phoneNumberVerificationCode = codeService.GeneratePhoneNumberCode();

        user.PhoneNumber = request.PhoneNumber;
        user.PhoneNumberCountryCode = request.PhoneNumberCountryCode;

        user.PhoneNumberVerificationCodeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(phoneNumberVerificationCode));
        user.PhoneNumberVerificationCodeSalt = hmac.Key;

        user.PhoneNumberVerificationExpiryTime = DateTime.UtcNow.AddMinutes(30);

        var updateResult = await userManager.UpdateAsync(user);

        if (!updateResult.Succeeded) return BadRequest("Error al actualizar información del usuario.");

        var message = $$"""
                        ¡Hola {{user.FirstName}} {{user.LastName}}! Nos complace que te tomes la seguridad de tu información tan seriamente como nosotros.

                        El código para verificar este teléfono es el siguiente:

                        {{phoneNumberVerificationCode}}

                        Gracias por usar DocHub.
                        """;

        var messageResponse = await phoneService.SendMessage(user.PhoneNumberCountryCode + user.PhoneNumber, message);

        return Ok();
    }

    [HttpPost("phone-verification")]
    public async Task<ActionResult<AccountDto?>> VerifyPhoneNumber([FromBody] PhoneNumberVerificationDto request)
    {
        if (string.IsNullOrEmpty(request.Email)) return BadRequest("No se ha proporcionado un correo.");
        if (string.IsNullOrEmpty(request.Code)) return BadRequest("No se ha proporcionado un código.");

        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Email == request.Email);

        if (user == null) return NotFound($"El usuario de correo {request.Email} no existe.");

        if (user.PhoneNumberConfirmed) return BadRequest("Este número de teléfono ya ha sido verificado.");

        var result = codeService.ValidatePhoneNumberCode(user, request.Code);

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

        var emailVerificationCode = codeService.GenerateEmailCode();
        user.EmailVerificationCodeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(emailVerificationCode));
        user.EmailVerificationCodeSalt = hmac.Key;

        user.EmailVerificationExpiryTime = DateTime.UtcNow.AddMinutes(30);

        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded) return BadRequest("Error al actualizar información del usuario.");

        // send email verification code
        var clientUrl = clientSettings.Value.Url;
        var subject = $"🔒 Verificación de correo para {user.FirstName}!";
        var htmlMessage = emailService.CreateVerifyEmailAddressEmailForUpdate(user, emailVerificationCode);

        var email = user.Email;

        if (!string.IsNullOrEmpty(email))
        {
            await emailService.SendMail(email, subject, htmlMessage);
        }

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
            if (!countryCodeUpdateResult.Succeeded)
                return BadRequest("Error al actualizar el código de país del número de teléfono.");
        }

        // update phoneNumber confirmation
        user.PhoneNumberConfirmed = false;
        var phoneNumberVerificationCode = codeService.GeneratePhoneNumberCode();

        user.PhoneNumberVerificationCodeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(phoneNumberVerificationCode));
        user.PhoneNumberVerificationCodeSalt = hmac.Key;

        user.PhoneNumberVerificationExpiryTime = DateTime.UtcNow.AddMinutes(30);

        var updateResult = await userManager.UpdateAsync(user);

        if (!updateResult.Succeeded) return BadRequest("Error al actualizar información del usuario.");

        // send phoneNumber verification code
        var message = $$"""
                        ¡Hola {{user.FirstName}} {{user.LastName}}! Nos complace que te tomes la seguridad de tu información tan seriamente como nosotros.

                        El código para verificar este teléfono es el siguiente:

                        {{phoneNumberVerificationCode}}

                        Gracias por usar DocHub.
                        """;

        var fullPhoneNumber = user.PhoneNumberCountryCode + user.PhoneNumber;

        var messageResponse = await phoneService.SendMessage(fullPhoneNumber, message);

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

        var emailVerificationCode = codeService.GenerateEmailCode();

        user.EmailVerificationCodeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(emailVerificationCode));
        user.EmailVerificationCodeSalt = hmac.Key;

        user.EmailVerificationExpiryTime = DateTime.UtcNow.AddMinutes(30);

        var updateResult = await userManager.UpdateAsync(user);

        if (!updateResult.Succeeded) return BadRequest("Error al actualizar información del usuario.");

        // send email verification code
        var clientUrl = configuration.GetValue<string>("ClientUrl");
        var subject = $"🔒 Verificación de correo para {user.FirstName}!";
        var htmlMessage = emailService.CreateVerifyEmailAddressEmailForUpdate(user, emailVerificationCode);

        var email = user.Email;

        if (!string.IsNullOrEmpty(email))
        {
            await emailService.SendMail(email, subject, htmlMessage);
        }


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
        var phoneNumberVerificationCode = codeService.GeneratePhoneNumberCode();

        user.PhoneNumberVerificationCodeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(phoneNumberVerificationCode));
        user.PhoneNumberVerificationCodeSalt = hmac.Key;

        user.PhoneNumberVerificationExpiryTime = DateTime.UtcNow.AddMinutes(30);

        var updateResult = await userManager.UpdateAsync(user);

        if (!updateResult.Succeeded) return BadRequest("Error al actualizar información del usuario.");

        // send phoneNumber verification code
        var message = $$"""
                        ¡Hola {{user.FirstName}} {{user.LastName}}! Nos complace que te tomes la seguridad de tu información tan seriamente como nosotros.

                        El código para verificar este teléfono es el siguiente:

                        {{phoneNumberVerificationCode}}

                        Gracias por usar DocHub.
                        """;

        var messageResponse = await phoneService.SendMessage(user.PhoneNumberCountryCode + user.PhoneNumber, message);

        return Ok();
    }

    [Authorize]
    [HttpGet("billing-details")]
    public async Task<ActionResult<BillingDetailsDto?>> GetBillingDetails()
    {
        var userId = User.GetUserId();

        var itemToReturn = await usersService.GetBillingDetailsAsync(userId);

        if (itemToReturn == null)
            return NotFound($"No se han encontrado detalles de facturación para el usuario con id {userId}.");

        itemToReturn.UserPaymentMethods = [..itemToReturn.UserPaymentMethods.OrderBy(x => !x.IsMain)];
        itemToReturn.UserAddresses = [..itemToReturn.UserAddresses.OrderBy(x => !x.IsBilling)];

        return itemToReturn;
    }

    [Authorize]
    [HttpPost("payment-method")]
    public async Task<ActionResult<UserPaymentMethodDto>> AddPaymentMethod(UserPaymentMethodCreateDto request)
    {
        if (string.IsNullOrEmpty(request.DisplayName)) return BadRequest("El nombre del método de pago es requerido.");
        if (string.IsNullOrEmpty(request.Last4))
            return BadRequest("Los últimos 4 dígitos de la tarjeta son requeridos.");
        if (string.IsNullOrEmpty(request.Brand)) return BadRequest("La marca de la tarjeta es requerida.");
        if (string.IsNullOrEmpty(request.Country)) return BadRequest("El país de la tarjeta es requerido.");
        if (string.IsNullOrEmpty(request.StripePaymentMethodId))
            return BadRequest("El id del método de pago de Stripe es requerido.");
        if (!request.IsMain.HasValue) return BadRequest("Debes especificar si el método de pago es principal.");
        if (!request.ExpirationMonth.HasValue) return BadRequest("El mes de expiración de la tarjeta es requerido.");
        if (!request.ExpirationYear.HasValue) return BadRequest("El año de expiración de la tarjeta es requerido.");

        var userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.UserPaymentMethods)
            .ThenInclude(x => x.PaymentMethod)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        if (user.UserPaymentMethods.Count == 0)
        {
            var email = user.Email;

            if (!string.IsNullOrEmpty(email))
            {
                var customerId = await stripeService.CreateCustomerAsync(email, user.FirstName + " " + user.LastName,
                    request.StripePaymentMethodId);
                user.StripeCustomerId = customerId;
            }
        }

        if (request.IsMain.Value == true)
        {
            var mainPaymentMethod = user.UserPaymentMethods.SingleOrDefault(x => x.IsMain);
            if (mainPaymentMethod != null) mainPaymentMethod.IsMain = false;
        }

        user.UserPaymentMethods.Add(new UserPaymentMethod
        {
            UserId = userId,
            IsMain = request.IsMain.Value,
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
        });

        var stripeCustomerId = user.StripeCustomerId;

        if (string.IsNullOrEmpty(stripeCustomerId))
            return BadRequest("No se ha encontrado un cliente de Stripe asociado a este usuario.");

        if (!await stripeService.AddPaymentMethodAsync(stripeCustomerId, request.StripePaymentMethodId,
                request.IsMain.Value))
            return BadRequest("Error agregando el método de pago a Stripe.");

        if (!await uow.Complete()) return BadRequest("Error guardando el método de pago.");

        return mapper.Map<UserPaymentMethodDto>(user.UserPaymentMethods.Last());
    }

    [Authorize]
    [HttpDelete("payment-method/{paymentMethodId}")]
    public async Task<ActionResult> DeletePaymentMethod(string paymentMethodId)
    {
        var userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.UserPaymentMethods)
            .ThenInclude(x => x.PaymentMethod)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        var paymentMethod =
            user.UserPaymentMethods.SingleOrDefault(x => x.PaymentMethod.StripePaymentMethodId == paymentMethodId);
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
        var userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.UserPaymentMethods)
            .ThenInclude(x => x.PaymentMethod)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        var paymentMethod =
            user.UserPaymentMethods.SingleOrDefault(x => x.PaymentMethod.StripePaymentMethodId == paymentMethodId);
        if (paymentMethod == null) return NotFound($"El método de pago con id {paymentMethodId} no existe.");

        var mainPaymentMethod = user.UserPaymentMethods.SingleOrDefault(x => x.IsMain);
        if (mainPaymentMethod?.PaymentMethod.StripePaymentMethodId == paymentMethodId)
            return BadRequest("Este método de pago ya es el principal.");
        if (mainPaymentMethod != null) mainPaymentMethod.IsMain = false;

        paymentMethod.IsMain = true;

        var stripeCustomerId = user.StripeCustomerId;

        if (string.IsNullOrEmpty(stripeCustomerId))
            return BadRequest("No se ha encontrado un cliente de Stripe asociado a este usuario.");

        if (!await stripeService.SetMainPaymentMethodAsync(stripeCustomerId, paymentMethodId))
            return BadRequest("Error actualizando el método de pago en Stripe.");

        if (!await uow.Complete()) return BadRequest("Error actualizando el método de pago.");

        return Ok();
    }

    [Authorize]
    [HttpPost("address")]
    public async Task<ActionResult<UserAddressDto>> AddAddress(UserAddressCreateDto request)
    {
        var userId = User.GetUserId();

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

        var (latitude, longitude) =
            await googleService.GetAddressCoordinatesAsync(googleService.GetAddressText(mapper.Map<Address>(request)));

        user.UserAddresses.Add(new UserAddress
        {
            UserId = userId,
            IsMain = request.IsMain,
            IsBilling = request.IsBilling,
            Address = new Address
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
        var userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.UserAddresses)
            .ThenInclude(x => x.Address)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        var address = user.UserAddresses.SingleOrDefault(x => x.Address.Id == addressId);
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
        var userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.UserAddresses)
            .ThenInclude(x => x.Address)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        var address = user.UserAddresses.SingleOrDefault(x => x.Address.Id == addressId);
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

        var (latitude, longitude) =
            await googleService.GetAddressCoordinatesAsync(googleService.GetAddressText(mapper.Map<Address>(request)));

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
        var userId = User.GetUserId();

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

        return mapper.Map<List<PaymentDto>>(
            user.PatientEvents.SelectMany(x => x.Event.EventPayments.Select(y => y.Payment)));
    }

    [Authorize]
    [HttpGet("medical-insurance-companies")]
    public async Task<ActionResult<List<UserMedicalInsuranceCompanyDto>>> GetMedicalInsuranceCompanies()
    {
        var userId = User.GetUserId();

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
    public async Task<ActionResult<AccountDto?>> AddMedicalInsuranceCompanyAsync(
        [FromForm] UserMedicalInsuranceCompanyCreateDto request)
    {
        var userId = User.GetUserId();

        if (request.MedicalInsuranceCompany == null)
            return BadRequest("No se ha enviado la compañía de seguro médico.");
        if (!request.MedicalInsuranceCompany.Id.HasValue)
            return BadRequest("No se ha enviado el ID de la compañía de seguro médico.");
        if (!request.IsMain.HasValue)
            return BadRequest("No se ha enviado si la compañía de seguro médico es principal o no.");
        if (request.File == null) return BadRequest("No se ha enviado el documento.");
        if (string.IsNullOrEmpty(request.PolicyNumber)) return BadRequest("No se ha enviado el número de póliza.");

        if (!await uow.UserRepository.ExistsByIdAsync(userId))
            return BadRequest($"Usuario de ID {userId} no fue encontrado.");

        if (!await uow.MedicalInsuranceCompanyRepository.ExistsByIdAsync(request.MedicalInsuranceCompany.Id.Value))
            return BadRequest(
                $"Compañía de seguro médico de ID {request.MedicalInsuranceCompany.Id.Value} no fue encontrada.");

        var file = request.File;
        var isMain = request.IsMain.Value;
        var medicalInsuranceCompany = request.MedicalInsuranceCompany;
        var policyNumber = request.PolicyNumber;
        var user = await userManager.Users
            .Include(x => x.UserMedicalInsuranceCompanies)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        if (user.UserMedicalInsuranceCompanies.Any(x => x.MedicalInsuranceCompanyId == medicalInsuranceCompany.Id))
            return BadRequest("Ya tienes esta compañía de seguro médico registrada.");

        var uploadResult = await cloudinaryService.UploadAsync(file, new ImageUploadParams
        {
            File = new FileDescription(file.FileName, file.OpenReadStream()),
            Folder = "Mediverse/UserMedicalInsuranceCompanies",
        });

        if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);

        var uploadThumbnailResult = await cloudinaryService.UploadAsync(file, new ImageUploadParams
        {
            File = new FileDescription(file.FileName, file.OpenReadStream()),
            Folder = "Mediverse/UserMedicalInsuranceCompanies/Thumbnails",
            Format = "jpg",
            Transformation = new Transformation().Page(1).Height(300).Width(400).Crop("fill").Gravity("north")
        });

        if (uploadThumbnailResult.Error != null) return BadRequest(uploadThumbnailResult.Error.Message);

        if (isMain)
        {
            var mainMedicalInsuranceCompany =
                user.UserMedicalInsuranceCompanies.FirstOrDefault(x => x.IsMain);
            if (mainMedicalInsuranceCompany != null) mainMedicalInsuranceCompany.IsMain = false;
        }

        user.UserMedicalInsuranceCompanies.Add(new UserMedicalInsuranceCompany
        {
            MedicalInsuranceCompanyId = medicalInsuranceCompany.Id.Value,
            IsMain = isMain,
            PolicyNumber = request.PolicyNumber,
            Document = new Document
            {
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
    public async Task<ActionResult<AccountDto?>> DeleteInsuranceByIdAsync([FromRoute] int insuranceId)
    {
        var userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.UserMedicalInsuranceCompanies)
            .ThenInclude(x => x.Document)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        if (!await uow.MedicalInsuranceCompanyRepository.ExistsByIdAsync(insuranceId))
            return BadRequest($"La compañía de seguro médico con id {insuranceId} no existe.");

        var toDelete =
            user.UserMedicalInsuranceCompanies.SingleOrDefault(x => x.MedicalInsuranceCompanyId == insuranceId);
        if (toDelete == null)
            return NotFound($"No estás registrado con la compañía de seguro médico con id {insuranceId}.");

        user.UserMedicalInsuranceCompanies.Remove(toDelete);
        if (!await uow.Complete()) return BadRequest("Error eliminando la compañía de seguro médico.");

        if (toDelete.Document != null)
        {
            if (!string.IsNullOrEmpty(toDelete.Document.PublicId))
            {
                var deleteResponse = await cloudinaryService.DeleteAsync(toDelete.Document.PublicId);
                if (deleteResponse.Error != null) return BadRequest(deleteResponse.Error.Message);
            }

            if (!string.IsNullOrEmpty(toDelete.Document.ThumbnailPublicId))
            {
                var thumbnailDeleteResponse =
                    await cloudinaryService.DeleteAsync(toDelete.Document.ThumbnailPublicId);
                if (thumbnailDeleteResponse.Error != null) return BadRequest(thumbnailDeleteResponse.Error.Message);
            }
        }

        return await usersService.GenerateAccountDtoAsync(userId);
    }

    [Authorize]
    [HttpDelete("medical-insurance-company-document/{documentId}")]
    public async Task<ActionResult<AccountDto?>> DeleteInsuranceDocumentByIdAsync([FromRoute] int documentId)
    {
        var userId = User.GetUserId();

        var user = await userManager.Users
            .AsNoTracking()
            .Include(x => x.UserMedicalInsuranceCompanies)
            .ThenInclude(x => x.Document)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        if (!await uow.DocumentRepository.ExistsByIdAsync(documentId))
            return BadRequest($"El documento de la compañía de seguro médico con id {documentId} no existe.");

        if (!user.UserMedicalInsuranceCompanies.Any(x => x.DocumentId == documentId))
            return BadRequest(
                $"No estás registrado con la compañía de seguro médico que tiene el documento con id {documentId}.");

        var document = await uow.DocumentRepository.GetByIdAsync(documentId);

        if (document == null)
            return NotFound($"No se ha encontrado el documento de la compañía de seguro médico con id {documentId}.");

        if (document != null)
        {
            if (!string.IsNullOrEmpty(document.PublicId))
            {
                var deleteResponse = await cloudinaryService.DeleteAsync(document.PublicId);
                if (deleteResponse.Error != null) return BadRequest(deleteResponse.Error.Message);
            }

            if (!string.IsNullOrEmpty(document.ThumbnailPublicId))
            {
                var thumbnailDeleteResponse =
                    await cloudinaryService.DeleteAsync(document.ThumbnailPublicId);
                if (thumbnailDeleteResponse.Error != null) return BadRequest(thumbnailDeleteResponse.Error.Message);
            }
        }

        uow.DocumentRepository.Delete(document!);

        if (!await uow.Complete()) return BadRequest("Error eliminando el documento de la compañía de seguro médico.");

        return await usersService.GenerateAccountDtoAsync(userId);
    }

    [Authorize]
    [HttpPut("medical-insurance-company/{medicalInsuranceCompanyId}")]
    public async Task<ActionResult> UpdateMedicalInsuranceCompany(int medicalInsuranceCompanyId,
        UserMedicalInsuranceCompanyUpdateDto request)
    {
        var userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.UserMedicalInsuranceCompanies)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        var medicalInsuranceCompany =
            user.UserMedicalInsuranceCompanies.SingleOrDefault(x =>
                x.MedicalInsuranceCompanyId == medicalInsuranceCompanyId);
        if (medicalInsuranceCompany == null)
            return NotFound($"La compañía de seguro médico con id {medicalInsuranceCompanyId} no existe.");

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
        var userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.DoctorMedicalInsuranceCompanies)
            .ThenInclude(x => x.MedicalInsuranceCompany)
            .ThenInclude(x => x.MedicalInsuranceCompanyPhoto)
            .ThenInclude(x => x.Photo)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        return mapper.Map<List<MedicalInsuranceCompanyDto>>(user.DoctorMedicalInsuranceCompanies
            .Select(x => x.MedicalInsuranceCompany).ToList());
    }

    [Authorize]
    [HttpPut("doctor-medical-insurance-company")]
    public async Task<ActionResult<AccountDto?>> ToggleDoctorInsuranceAsync([FromQuery] int insuranceId,
        [FromQuery] bool isActive)
    {
        var userId = User.GetUserId();

        var user = await userManager.Users
            .Include(x => x.DoctorMedicalInsuranceCompanies)
            .SingleOrDefaultAsync(x => x.Id == userId);

        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        if (!await uow.UserRepository.HasDoctorRoleByIdAsync(userId))
            return BadRequest($"El usuario con id {userId} no es un doctor.");

        if (!await uow.MedicalInsuranceCompanyRepository.ExistsByIdAsync(insuranceId))
            return BadRequest($"La compañía de seguro médico con id {insuranceId} no existe.");

        if (user.DoctorMedicalInsuranceCompanies.Any(x => x.MedicalInsuranceCompanyId == insuranceId))
        {
            var doctorMedicalInsuranceCompany =
                user.DoctorMedicalInsuranceCompanies.SingleOrDefault(x => x.MedicalInsuranceCompanyId == insuranceId);

            if (doctorMedicalInsuranceCompany != null)
            {
                user.DoctorMedicalInsuranceCompanies.Remove(doctorMedicalInsuranceCompany);
            }
        }
        else
        {
            user.DoctorMedicalInsuranceCompanies.Add(new DoctorMedicalInsuranceCompany(insuranceId));
        }

        if (!await uow.Complete()) return BadRequest("Error actualizando la compañía de seguro médico del doctor.");

        return await usersService.GenerateAccountDtoAsync(userId);
    }

    [Authorize]
    [HttpPut("email")]
    public async Task<ActionResult<AccountDto?>> UpdateEmail([FromBody] EmailUpdateDto request)
    {
        if (string.IsNullOrEmpty(request.Password)) return BadRequest("No se ha enviado la contraseña.");
        if (string.IsNullOrEmpty(request.Email)) return BadRequest("No se ha enviado el nuevo correo.");

        using var hmac = new HMACSHA512();

        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Email == User.GetEmail());

        if (user == null) return NotFound($"El usuario de correo {User.GetEmail()} no existe.");

        if (!userManager.CheckPasswordAsync(user, request.Password).Result)
            return BadRequest("La contraseña es incorrecta.");

        if (await userManager.FindByEmailAsync(request.Email) != null)
            return BadRequest("Ya existe una cuenta con este correo.");

        var result = await userManager.SetEmailAsync(user, request.Email);
        if (!result.Succeeded) return BadRequest("Error al actualizar correo.");

        var updateUsernameResult = await userManager.SetUserNameAsync(user, request.Email);
        if (!updateUsernameResult.Succeeded) return BadRequest("Error al actualizar nombre de usuario.");

        user.EmailConfirmed = false;

        var emailVerificationCode = codeService.GenerateEmailCode();
        user.EmailVerificationCodeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(emailVerificationCode));
        user.EmailVerificationCodeSalt = hmac.Key;
        user.EmailVerificationExpiryTime = DateTime.UtcNow.AddMinutes(30);

        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded) return BadRequest("Error al actualizar información del usuario.");

        var clientUrl = clientSettings.Value.Url;
        var verifyEmailUrl = $"{clientUrl}/auth/verify-email?email={user.Email}";
        var subject = $"🔒 DocHub: Verifica tu correo {user.FirstName}!";
        var htmlMessage = emailService.CreateVerifyEmailAddressEmailForUpdate(user, emailVerificationCode);

        var email = user.Email;

        if (string.IsNullOrEmpty(email)) return BadRequest("No se ha encontrado el correo del usuario.");

        await emailService.SendMail(email, subject, htmlMessage);

        var itemToReturn = await usersService.GenerateAccountDtoAsync(user.Id);

        return itemToReturn;
    }

    [Authorize]
    [HttpPut("password")]
    public async Task<ActionResult> UpdatePassword([FromBody] PasswordUpdateDto request)
    {
        if (string.IsNullOrEmpty(request.CurrentPassword)) return BadRequest("No se ha enviado la contraseña actual.");
        if (string.IsNullOrEmpty(request.NewPassword)) return BadRequest("No se ha enviado la nueva contraseña.");
        if (string.IsNullOrEmpty(request.ConfirmPassword))
            return BadRequest("No se ha enviado la confirmación de la nueva contraseña.");

        if (request.NewPassword != request.ConfirmPassword) return BadRequest("Las contraseñas no coinciden.");

        var email = User.GetEmail();

        if (string.IsNullOrEmpty(email)) return BadRequest("No se ha encontrado el correo del usuario.");

        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Email == email);

        if (user == null) return NotFound($"El usuario de correo {email} no existe.");

        var result = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

        if (!result.Succeeded) return BadRequest("Error actualizando contraseña.");

        return Ok();
    }

    [Authorize]
    [HttpPut("account-details")]
    public async Task<ActionResult<AccountDto>> UpdateAccountDetailsAsync([FromForm] AccountDetailsUpdateDto request)
    {
        var userId = User.GetUserId();
        var roles = User.GetRoles();

        Log.Information("Update request for user {UserId}: {@Request}", userId, request);

        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await GetUserWithDependencies(userId);
        if (user == null) return NotFound($"User with id {userId} not found.");

        await HandleUserUpdate(user, request, roles);

        return Ok(await usersService.GenerateAccountDtoAsync(userId));
    }

    private async Task<AppUser?> GetUserWithDependencies(int userId)
    {
        return await userManager.Users
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
            .Include(x => x.DoctorSpecialty).ThenInclude(x => x.Specialty)
            .AsSplitQuery()
            .FirstOrDefaultAsync(x => x.Id == userId);
    }

    private async Task HandleUserUpdate(AppUser user, AccountDetailsUpdateDto request, IEnumerable<string> roles)
    {
        mapper.Map(request, user);

        if (roles.Contains("Doctor"))
        {
            await HandleMedicalLicenseUpdate(user, request);
            HandlePaymentMethodsUpdate(user, request);
        }

        await HandlePhotoUpdate(user, request);
    }

    private async Task HandleMedicalLicenseUpdate(AppUser user, AccountDetailsUpdateDto request)
    {
        if (request.GetSpecialty()?.Id == null)
            throw new ArgumentException("Specialty information is required");

        var mainLicense = user.UserMedicalLicenses.FirstOrDefault(x => x.IsMain);
        var shouldUpdateLicense = mainLicense?.MedicalLicense.MedicalLicenseSpecialty.SpecialtyId !=
                                  request.GetSpecialty()?.Id.Value;

        // TODO - Handle specialty change
        if (shouldUpdateLicense)
        {
            await HandleSpecialtyChange(user, request, request.GetSpecialty().Id.Value, mainLicense);
        }
        else if (request.File != null && request.File.Length > 0)
        {
            await UpdateExistingMedicalLicense(mainLicense!, request.File);
        }
    }

    private async Task HandleSpecialtyChange(AppUser user, AccountDetailsUpdateDto request, int specialtyId,
        UserMedicalLicense? existingLicense)
    {
        // TODO - File handling
        // if (request.File == null || request.File.Length == 0)
        //     throw new ArgumentException("Medical license proof is required for specialty change");
        // var uploadResult = await HandleFileUpload(request.File, "Mediverse/DoctorMedicalLicenses");
        // await RemoveExistingMedicalLicense(existingLicense);

        var specialty = await uow.SpecialtyRepository.GetByIdAsync(specialtyId);
        if (specialty == null) throw new ArgumentException($"Specialty with id {specialtyId} does not exist");

        user.DoctorSpecialty = new DoctorSpecialty(specialty);

        // user.UserMedicalLicenses.Clear();
        // user.UserMedicalLicenses.Add(CreateNewMedicalLicense(specialtyId, uploadResult));
    }

    private async Task RemoveExistingMedicalLicense(UserMedicalLicense? license)
    {
        if (license?.MedicalLicense.MedicalLicenseDocument?.Document?.PublicId == null) return;

        var deletionResult =
            await cloudinaryService.DeleteAsync(license.MedicalLicense.MedicalLicenseDocument.Document.PublicId);
        if (deletionResult.Error != null)
            throw new ApplicationException("Error deleting previous medical license: " + deletionResult.Error.Message);
    }

    private static UserMedicalLicense CreateNewMedicalLicense(int specialtyId, ImageUploadResult uploadResult)
    {
        return new UserMedicalLicense(
            specialtyId,
            uploadResult.PublicId,
            uploadResult.SecureUrl.AbsoluteUri)
        {
            IsMain = true
        };
    }

    private async Task<ImageUploadResult> HandleFileUpload(IFormFile file, string folder)
    {
        await using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = folder
        };

        var uploadResult = await cloudinaryService.UploadAsync(file, uploadParams);
        if (uploadResult.Error != null)
            throw new ApplicationException($"File upload failed: {uploadResult.Error.Message}");

        return uploadResult;
    }

    private async Task UpdateExistingMedicalLicense(UserMedicalLicense license, IFormFile file)
    {
        if (license.MedicalLicense.MedicalLicenseDocument?.Document == null)
            throw new ArgumentException("Existing medical license document not found");

        var uploadResult = await HandleFileUpload(file, "Mediverse/DoctorMedicalLicenses");
        await DeleteCloudinaryResource(license.MedicalLicense.MedicalLicenseDocument.Document.PublicId);

        license.MedicalLicense.MedicalLicenseDocument = new MedicalLicenseDocument(
            uploadResult.PublicId,
            uploadResult.SecureUrl.AbsoluteUri);
    }

    private async Task DeleteCloudinaryResource(string publicId)
    {
        var deletionResult = await cloudinaryService.DeleteAsync(publicId);
        if (deletionResult.Error != null)
            throw new ApplicationException("Error deleting Cloudinary resource: " + deletionResult.Error.Message);
    }

    private void HandlePaymentMethodsUpdate(AppUser user, AccountDetailsUpdateDto request)
    {
        if (string.IsNullOrEmpty(request.AcceptedPaymentMethods)) return;

        var newPaymentMethods = request.AcceptedPaymentMethods
            .Split(',')
            .Select(int.Parse)
            .ToList();

        var currentPaymentMethods = user.DoctorPaymentMethodTypes
            .Select(x => x.PaymentMethodTypeId)
            .ToList();

        if (!newPaymentMethods.SequenceEqual(currentPaymentMethods))
        {
            user.DoctorPaymentMethodTypes.Clear();
            user.DoctorPaymentMethodTypes.AddRange(newPaymentMethods.Select(id =>
                new DoctorPaymentMethodType
                {
                    DoctorId = user.Id,
                    PaymentMethodTypeId = id
                }));
        }
    }

    private async Task HandlePhotoUpdate(AppUser user, AccountDetailsUpdateDto request)
    {
        if (request.RemoveAvatar)
        {
            await HandleAvatarRemoval(user);
        }
        else if (request.Photo != null)
        {
            await HandleNewPhotoUpload(user, request.Photo);
        }
    }

    private async Task HandleAvatarRemoval(AppUser user)
    {
        if (user.UserPhoto?.Photo == null) return;

        if (!await photosService.DeleteAsync(user.UserPhoto.Photo))
            throw new ApplicationException("Failed to delete user photo");

        user.UserPhoto = null;
    }

    private async Task HandleNewPhotoUpload(AppUser user, IFormFile photo)
    {
        var uploadResult = await HandleFileUpload(photo, "Mediverse/UserPhoto", true);
        var newPhoto = new Photo(uploadResult, user.Id);

        if (user.UserPhoto?.Photo != null)
            await photosService.DeleteAsync(user.UserPhoto.Photo);

        uow.PhotoRepository.Add(newPhoto);
        user.UserPhoto = new UserPhoto { Photo = newPhoto };
    }

    private async Task<ImageUploadResult> HandleFileUpload(IFormFile file, string folder, bool isAvatar = false)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, file.OpenReadStream()),
            Folder = folder,
            Transformation = isAvatar
                ? new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
                : null
        };

        return await cloudinaryService.UploadAsync(file, uploadParams);
    }

    [Authorize]
    [HttpPost("work-schedule")]
    public async Task<ActionResult<AccountDto?>> UpdateWorkScheduleAsync([FromBody] WorkScheduleUpdateDto request)
    {
        var userId = User.GetUserId();

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
                    user.DoctorWorkSchedules.Add(new DoctorWorkSchedule
                    {
                        UserId = userId,
                        WorkSchedule = new WorkSchedule
                        {
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
                await uow.UserRepository.DeleteDoctorWorkScheduleSettingsAsync(user.DoctorWorkScheduleSettings
                    .WorkScheduleSettings);
                user.DoctorWorkScheduleSettings = null!;
            }

            WorkScheduleSettings workScheduleSettings = new()
            {
                StartTime = TimeOnly.Parse(request.StartTime).ToTimeSpan(),
                EndTime = TimeOnly.Parse(request.EndTime).ToTimeSpan(),
                MinutesPerBlock = request.MinutesPerBlock
            };

            user.DoctorWorkScheduleSettings = new DoctorWorkScheduleSettings
            {
                UserId = userId,
                WorkScheduleSettings = workScheduleSettings
            };
        }

        if (uow.HasChanges())
        {
            if (!await uow.Complete()) return BadRequest("Error actualizando los horarios de trabajo.");
        }

        return await usersService.GenerateAccountDtoAsync(userId);
    }

    [Authorize]
    [HttpGet("medical-record")]
    public async Task<ActionResult<MedicalRecordDto?>> GetMedicalRecord()
    {
        var userId = User.GetUserId();

        return await uow.UserRepository.GetMedicalRecordDtoAsync(userId);
    }

    [Authorize]
    [HttpPut("medical-record")]
    public async Task<ActionResult<MedicalRecordDto?>> UpdateMedicalRecord([FromBody] MedicalRecordUpdateDto request)
    {
        var userId = User.GetUserId();
        var result = await medicalRecordsService.UpdateMedicalRecordAsync(userId, request);

        if (result.Result is BadRequestObjectResult badRequest) return BadRequest(badRequest.Value);

        return result.Value != null
            ? Ok(result.Value)
            : NotFound("Medical record not found");
    }

    [Authorize]
    [HttpGet("satisfaction-surveys")]
    public async Task<ActionResult<List<SatisfactionSurveyDto>>> GetSatisfactionSurveys()
    {
        var userId = User.GetUserId();

        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Id == userId);
        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        var events = await uow.EventRepository.GetPendingSatisfactionSurveysAsync(userId);

        return mapper.Map<List<SatisfactionSurveyDto>>(events);
    }

    [Authorize]
    [HttpPost("review")]
    public async Task<ActionResult> SubmitReview([FromBody] ReviewCreateDto request)
    {
        var userId = User.GetUserId();

        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Id == userId);
        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        var patientEvent = await uow.EventRepository.GetByIdAsync(request.EventId);

        if (patientEvent == null) return NotFound($"El evento con id {request.EventId} no existe.");

        patientEvent.IsServiceRecommended = request.IsServiceRecommended;

        var review = new Review
        {
            Rating = request.Rating,
            Content = request.Comment,
            DoctorReview = new DoctorReview
            {
                DoctorId = patientEvent.DoctorEvent.Doctor.Id,
            },
            UserReview = new UserReview
            {
                UserId = userId,
            }
        };

        patientEvent.IsSatisfactionSurveyCompleted = true;

        await uow.UserRepository.AddReviewAsync(review);

        if (uow.HasChanges())
        {
            if (!await uow.Complete()) return BadRequest("Error creando la revisión.");
        }

        return Ok();
    }

    [Authorize]
    [HttpPost("review/skip/{eventId}")]
    public async Task<ActionResult> SkipReview([FromRoute] int eventId)
    {
        var userId = User.GetUserId();

        var user = await userManager.Users.SingleOrDefaultAsync(x => x.Id == userId);
        if (user == null) return NotFound($"El usuario con id {userId} no existe.");

        var patientEvent = await uow.EventRepository.GetByIdAsync(eventId);

        if (patientEvent == null) return NotFound($"El evento con id {eventId} no existe.");

        patientEvent.IsSatisfactionSurveyCompleted = true;

        if (uow.HasChanges())
        {
            if (!await uow.Complete()) return BadRequest("Error omitiendo la revisión.");
        }

        return Ok();
    }
}