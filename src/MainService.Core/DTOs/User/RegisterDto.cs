using System.ComponentModel.DataAnnotations;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.DTOs.User;

public class RegisterDto
{
    // Existing properties
    [Required(ErrorMessage = "El nombre es requerido.")]
    [StringLength(500, ErrorMessage = "Los nombres no deben exceder 500 caractéres.")]
    public string? FirstName { get; set; }

    [Required(ErrorMessage = "Los apellidos son requeridos.")]
    [StringLength(500, ErrorMessage = "Los apellidos no deben exceder 500 caractéres.")]
    public string? LastName { get; set; }

    [Required(ErrorMessage = "El sexo es requerido.")]
    public OptionDto? Sex { get; set; }

    [Required(ErrorMessage = "El email es requerido.")]
    [EmailAddress(ErrorMessage = "Email inválido.")]
    public string? Email { get; set; }

    [Required(ErrorMessage = "La fecha de nacimiento es requerida.")]
    public DateTime? DateOfBirth { get; set; }

    [Required(ErrorMessage = "La contraseña es requerida.")]
    public string? Password { get; set; }

    [Required(ErrorMessage = "Debes confirmar la contraseña.")]
    [Compare("Password", ErrorMessage = "Las contraseñas no coinciden.")]
    public string? ConfirmPassword { get; set; }

    [Required(ErrorMessage = "Debes aceptar los términos y condiciones.")]
    [Range(typeof(bool), "true", "true", ErrorMessage = "Debes aceptar los términos y condiciones.")]
    public bool? AgreeTerms { get; set; }
}