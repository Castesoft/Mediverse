using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace MainService.Core.DTOs.User;

public class DoctorRegisterDto
{
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [StringLength(500, ErrorMessage = "Los nombres no deben exceder 500 caractéres.")]
    public required string FirstName { get; set; }

    [Required(ErrorMessage = "El apellido es obligatorio.")]
    [StringLength(500, ErrorMessage = "Los apellidos no deben exceder 500 caractéres.")]
    public required string LastName { get; set; }

    [Required(ErrorMessage = "El género es obligatorio.")]
    public required string Gender { get; set; }

    public string? OtherGender { get; set; }

    [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
    [EmailAddress(ErrorMessage = "Email inválido.")]
    public required string Email { get; set; }

    [Required(ErrorMessage = "La fecha de nacimiento es obligatoria.")]
    public required DateOnly DateOfBirth { get; set; }

    [Required(ErrorMessage = "La contraseña es obligatoria.")]
    public required string Password { get; set; }

    [Required(ErrorMessage = "La confirmación de la contraseña es obligatoria.")]
    [Compare("Password", ErrorMessage = "Las contraseñas no coinciden.")]
    public required string ConfirmPassword { get; set; }

    [Required(ErrorMessage = "Debes aceptar los términos y condiciones.")]
    [Range(typeof(bool), "true", "true", ErrorMessage = "Debes aceptar los términos y condiciones.")]
    public required bool AgreeTerms { get; set; }

    [Required(ErrorMessage = "El teléfono es obligatorio.")]
    public required string Phone { get; set; }

    [Required(ErrorMessage = "El estado es obligatorio.")]
    public required string State { get; set; }

    [Required(ErrorMessage = "La ciudad es obligatoria.")]
    public required string City { get; set; }

    [Required(ErrorMessage = "La calle es obligatoria.")]
    public required string Street { get; set; }

    [Required(ErrorMessage = "El código postal es obligatorio.")]
    public required string Zipcode { get; set; }

    [Required(ErrorMessage = "El barrio es obligatorio.")]
    public required string Neighborhood { get; set; }

    [Required(ErrorMessage = "El número exterior es obligatorio.")]
    public required string ExteriorNumber { get; set; }

    public string? InteriorNumber { get; set; }

    [Required(ErrorMessage = "La especialidad es obligatoria.")]
    public required string SpecialtyId { get; set; }

    [Required(ErrorMessage = "Las formas de pago aceptadas son obligatorias.")]
    public required string AcceptedPaymentMethods { get; set; }

    [Required(ErrorMessage = "Se requiere especificar si se aceptan pagos con tarjeta anticipada.")]
    public required bool RequireAnticipatedCardPayments { get; set; }

    [Required(ErrorMessage = "Se requiere especificar si la dirección es la misma.")]
    public required bool SameAddress { get; set; }

    [Required(ErrorMessage = "El estado de facturación es obligatorio.")]
    public required string BillingState { get; set; }

    [Required(ErrorMessage = "La ciudad de facturación es obligatoria.")]
    public required string BillingCity { get; set; }

    [Required(ErrorMessage = "La dirección de facturación es obligatoria.")]
    public required string BillingStreet { get; set; }

    [Required(ErrorMessage = "El código postal de facturación es obligatorio.")]
    public required string BillingZipcode { get; set; }

    [Required(ErrorMessage = "El barrio de facturación es obligatorio.")]
    public required string BillingNeighborhood { get; set; }

    [Required(ErrorMessage = "El número exterior de facturación es obligatorio.")]
    public required string BillingExteriorNumber { get; set; }

    public string? BillingInteriorNumber { get; set; }

    [Required(ErrorMessage = "El nombre para mostrar es obligatorio.")]
    public required string DisplayName { get; set; }

    [Required(ErrorMessage = "El id del método de pago de Stripe es obligatorio.")]
    public required string StripePaymentMethodId { get; set; }

    [Required(ErrorMessage = "Los últimos 4 dígitos son obligatorios.")]
    public required string Last4 { get; set; }

    [Required(ErrorMessage = "El mes de expiración es obligatorio.")]
    public required int ExpirationMonth { get; set; }

    [Required(ErrorMessage = "El año de expiración es obligatorio.")]
    public required int ExpirationYear { get; set; }

    [Required(ErrorMessage = "La marca es obligatoria.")]
    public required string Brand { get; set; }

    [Required(ErrorMessage = "El país es obligatorio.")]
    public required string Country { get; set; }
}