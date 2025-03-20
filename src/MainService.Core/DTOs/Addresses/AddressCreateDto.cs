using System.ComponentModel.DataAnnotations;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.DTOs.Addresses;

public class AddressCreateDto
{
    [MaxLength(500, ErrorMessage = "El nombre no debe exceder 500 caracteres.")]
    public required string Name { get; set; }

    [Required(ErrorMessage = "La calle es requerida.")]
    [MaxLength(200, ErrorMessage = "La calle debe tener máximo 200 caracteres.")]
    public required string Street { get; set; }

    [Required(ErrorMessage = "La ciudad es requerida")]
    public required string City { get; set; }

    [Required(ErrorMessage = "El estado es requerido.")]
    public required string State { get; set; }

    [Required(ErrorMessage = "El código postal es requerido.")]
    public required string Zipcode { get; set; }

    [Required(ErrorMessage = "El barrio es requerido.")]
    public required string Neighborhood { get; set; }

    [Required(ErrorMessage = "El número exterior es requerido.")]
    [MaxLength(20, ErrorMessage = "El número exterior debe tener máximo 20 caracteres.")]
    public required string ExteriorNumber { get; set; }

    [MaxLength(20, ErrorMessage = "El número interior debe tener máximo 20 caracteres.")]
    public string? InteriorNumber { get; set; }

    [Required(ErrorMessage = "Se debe especificar si es la dirección principal.")]
    public bool? IsDefault { get; set; }

    [Required(ErrorMessage = "Se debe especificar si es de facturación.")]
    public bool? IsBilling { get; set; }

    [MaxLength(500, ErrorMessage = "Las notas no deben exceder 500 caracteres.")]
    public string? Notes { get; set; }
}