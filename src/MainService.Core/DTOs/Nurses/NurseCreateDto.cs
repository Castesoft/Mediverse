using System.ComponentModel.DataAnnotations;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.DTOs.Nurses;
public class NurseCreateDto
{
    // required and min length 3 and max length 50
    [Required(ErrorMessage = "El nombre es requerido.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres.")]
    public string? FirstName { get; set; }
    [Required(ErrorMessage = "El apellido es requerido.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El apellido debe tener entre 3 y 100 caracteres.")]
    public string? LastName { get; set; }
    [Required(ErrorMessage = "La fecha de nacimiento es requerida.")]
    [StringLength(300, MinimumLength = 4, ErrorMessage = "La fecha de nacimiento debe tener entre 4 y 300 caracteres.")]
    public string? DateOfBirth { get; set; }
    [Required(ErrorMessage = "El email es requerido.")]
    [EmailAddress(ErrorMessage = "El email no es válido.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El email debe tener entre 3 y 100 caracteres.")]
    public string? Email { get; set; }
    [Required(ErrorMessage = "El sexo es requerido.")]
    public OptionDto? Sex { get; set; }
    [Required(ErrorMessage = "El número de teléfono es requerido.")]
    [Phone(ErrorMessage = "El número de teléfono no es válido.")]
    [StringLength(20, MinimumLength = 8, ErrorMessage = "El número de teléfono debe tener entre 8 y 20 caracteres.")]
    public string? PhoneNumber { get; set; }
    public string? RecommendedBy { get; set; }
}