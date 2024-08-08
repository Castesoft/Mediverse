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

namespace MainService.Controllers;
public class AccountController(
    UserManager<AppUser> userManager, 
    SignInManager<AppUser> signInManager, 
    IMapper mapper, 
    ITokenService tokenService, 
    ICloudinaryService cloudinaryService, 
    IConfiguration configuration, 
    IEmailService emailService, 
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
    public async Task<ActionResult<AccountDto>> GetAccountAsync()
    {
        int id = User.GetUserId();

        var itemToReturn = await usersService.GenerateAccountDtoAsync(id);

        return itemToReturn;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AccountDto>> LoginAsync([FromBody]LoginDto request)
    {
        AppUser user = await userManager.FindByEmailAsync(request.Email);

        if (user == null) return Unauthorized("Correo o contraseña incorrectos.");

        var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, false);

        if (!result.Succeeded) return Unauthorized("Correo o contraseña incorrectos.");

        var itemToReturn = await usersService.GenerateAccountDtoAsync(user.Id);

        itemToReturn.Token = await tokenService.CreateToken(user);

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
    public async Task<ActionResult<AccountDto>> RegisterDoctorAsync([FromForm] IFormFile file, [FromForm] string json)
    {
        if (file == null || file.Length == 0) return BadRequest("No se ha enviado una prueba de especialidad.");

        var request = JsonSerializer.Deserialize<DoctorRegisterDto>(json);

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
                Street = request.Address,
                Zipcode = request.ZipCode,
            },
            IsMain = true,
            IsBilling = request.SameAddress ? true : false
        };
        user.UserAddresses.Add(mainAddress);

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
                    Zipcode = request.BillingZipCode,
                },
                IsMain = false,
                IsBilling = true
            };
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

         var uploadResult = await cloudinaryService.Upload(file, new() {
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
        string resetUrl = $"{clientUrl}/auth/sign-in/new-password?resetToken={resetToken}&firstName={user.FirstName}&email={user.Email}";

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
    public async Task<ActionResult<AccountDto>> VerifyPhoneNumber([FromBody] PhoneNumberVerificationDto request)
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

    [AllowAnonymous]
    [HttpGet("register-doctor-fields")]
    public async Task<ActionResult<DoctorRegisterFieldsDto>> GetDoctorRegisterFields()
    {
        var item = new DoctorRegisterFieldsDto
        {
            Specialties = await usersService.GetSpecialtiesAsync(),
            PaymentMethodTypes = await usersService.GetPaymentMethodTypesAsync()
        };

        return item;
    }

    [Authorize]
    [HttpGet("billing-details")]
    public async Task<ActionResult<BillingDetailsDto>> GetBillingDetails()
    {
        int userId = User.GetUserId();

        var itemToReturn = await usersService.GetBillingDetailsAsync(userId);

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

        UserPaymentMethod paymentMethod = user.UserPaymentMethods.SingleOrDefault(x => x.PaymentMethod.StripePaymentMethodId == paymentMethodId);
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

        UserPaymentMethod paymentMethod = user.UserPaymentMethods.SingleOrDefault(x => x.PaymentMethod.StripePaymentMethodId == paymentMethodId);
        if (paymentMethod == null) return NotFound($"El método de pago con id {paymentMethodId} no existe.");

        UserPaymentMethod mainPaymentMethod = user.UserPaymentMethods.SingleOrDefault(x => x.IsMain);
        if (mainPaymentMethod.PaymentMethod.StripePaymentMethodId == paymentMethodId) return BadRequest("Este método de pago ya es el principal.");
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

        user.UserAddresses.Add(new() {
            UserId = userId,
            IsMain = request.IsMain,
            IsBilling = request.IsBilling,
            Address = new()
            {
                State = request.State,
                City = request.City,
                Street = request.Address,
                Zipcode = request.ZipCode
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

        UserAddress address = user.UserAddresses.SingleOrDefault(x => x.Address.Id == addressId);
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

        UserAddress address = user.UserAddresses.SingleOrDefault(x => x.Address.Id == addressId);
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

        address.IsMain = request.IsMain;
        address.IsBilling = request.IsBilling;
        address.Address.State = request.State;
        address.Address.City = request.City;
        address.Address.Street = request.Address;
        address.Address.Zipcode = request.ZipCode;

        if (!uow.HasChanges()) return Ok();
        if (!await uow.Complete()) return BadRequest("Error actualizando la dirección.");

        return Ok();
    }
}
