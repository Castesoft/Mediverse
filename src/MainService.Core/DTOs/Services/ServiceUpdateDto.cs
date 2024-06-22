using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.Services;

public class ServiceUpdateDto
{
    [Required(ErrorMessage = "El nombre es requerido.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres.")]
    public string Name { get; set; }
    
    [Required(ErrorMessage = "La descripción es requerida.")]
    [StringLength(500, MinimumLength = 3, ErrorMessage = "La descripción debe tener entre 3 y 500 caracteres.")]
    public string Description { get; set; }
    
    [Required(ErrorMessage = "El precio es requerido.")]
    [Range(1, 1000000, ErrorMessage = "El precio debe estar entre 1 y 1000000.")]
    public decimal Price { get; set; }
    
    [Range(0, 1, ErrorMessage = "El descuento debe estar entre 0 y 1.")]
    public double Discount { get; set; }
}
