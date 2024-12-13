using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.Prescription;

public class PrescriptionUpdateDto
{
    [Required(ErrorMessage = "Las notas son requeridas.")]
    [StringLength(500, MinimumLength = 3, ErrorMessage = "Las notas deben tener entre 3 y 500 caracteres.")]
    public string? Notes { get; set; }
}
