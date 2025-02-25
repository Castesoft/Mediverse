using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace MainService.Core.DTOs.Nurses;

public class NurseCreateDto
{
    [Required(ErrorMessage = "El nombre es requerido.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres.")]
    public required string FirstName { get; set; }

    [Required(ErrorMessage = "El apellido es requerido.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El apellido debe tener entre 3 y 100 caracteres.")]
    public required string LastName { get; set; }

    [Required(ErrorMessage = "La fecha de nacimiento es requerida.")]
    public required DateTime DateOfBirth { get; set; }

    [Required(ErrorMessage = "El email es requerido.")]
    [EmailAddress(ErrorMessage = "El email no es válido.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El email debe tener entre 3 y 100 caracteres.")]
    public required string Email { get; set; }

    [Required(ErrorMessage = "El sexo es requerido.")]
    public required string Sex { get; set; }

    [Required(ErrorMessage = "El número de teléfono es requerido.")]
    [Phone(ErrorMessage = "El número de teléfono no es válido.")]
    [StringLength(20, MinimumLength = 8, ErrorMessage = "El número de teléfono debe tener entre 8 y 20 caracteres.")]
    public required string PhoneNumber { get; set; }

    public ICollection<IFormFile>? Files { get; set; }

    public string? RecommendedBy { get; set; }
}