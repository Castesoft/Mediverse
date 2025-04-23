using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.Nurses;

public class NurseAssociateDto
{
    [Required(ErrorMessage = "El correo electrónico es requerido.")]
    [EmailAddress(ErrorMessage = "Formato de correo electrónico inválido.")]
    public string Email { get; set; } = null!;

    [MaxLength(100)]
    public string? FirstName { get; set; }
    
    [MaxLength(100)]
    public string? LastName { get; set; }
}