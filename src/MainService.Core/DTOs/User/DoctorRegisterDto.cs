using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace MainService.Core.DTOs.User;
public class DoctorRegisterDto
{
    [Required]
    [StringLength(500, ErrorMessage = "Los nombres no deben exceder 500 caractéres.")]
    public string FirstName { get; set; }

    [Required]
    [StringLength(500, ErrorMessage = "Los apellidos no deben exceder 500 caractéres.")]
    public string LastName { get; set; }

    [Required]
    public string Gender { get; set; }
    public string OtherGender { get; set; }

    [Required]
    [EmailAddress(ErrorMessage = "Email inválido.")]
    public string Email { get; set; }

    [Required]
    public DateOnly DateOfBirth { get; set; }

    [Required]
    public string Password { get; set; }

    [Required]
    [Compare("Password", ErrorMessage = "Las contraseñas no coinciden.")]
    public string ConfirmPassword { get; set; }

    [Required]
    [Range(typeof(bool), "true", "true", ErrorMessage = "Debes aceptar los términos y condiciones.")]
    public bool AgreeTerms { get; set; }

    [Required]
    public string Phone { get; set; }

    [Required]
    public string State { get; set; }

    [Required]
    public string City { get; set; }

    [Required]
    public string Address { get; set; }

    [Required]
    public string ZipCode { get; set; }

    [Required]
    public string SpecialtyId { get; set; }

    [Required]
    public string AcceptedPaymentMethods { get; set; }

    [Required]
    public bool SameAddress { get; set; }

    [Required]
    public string BillingState { get; set; }

    [Required]
    public string BillingCity { get; set; }

    [Required]
    public string BillingAddress { get; set; }

    [Required]
    public string BillingZipCode { get; set; }

    [Required]
    public string DisplayName { get; set; }

    [Required]
    public string StripePaymentMethodId { get; set; }

    [Required]
    public string Last4 { get; set; }

    [Required]
    public int ExpirationMonth { get; set; }

    [Required]
    public int ExpirationYear { get; set; }

    [Required]
    public string Brand { get; set; }

    [Required]
    public string Country { get; set; }

}