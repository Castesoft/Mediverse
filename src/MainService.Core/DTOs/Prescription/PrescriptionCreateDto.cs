using System.ComponentModel.DataAnnotations;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.DTOs.Prescription;

public class PrescriptionCreateDto
{
    [Required(ErrorMessage = "La fecha es requerida.")]
    public DateTime? Date { get; set; }
    
    [Required(ErrorMessage = "Los medicamentos son requeridos.")]
    public List<PrescriptionItemCreateDto> Items { get; set; } = [];

    [Required(ErrorMessage = "El paciente es requerido.")]
    public OptionDto? Patient { get; set; }
    
    public OptionDto? Event { get; set; }

    [Required(ErrorMessage = "La clínica es requerida.")]
    public OptionDto? Clinic { get; set; }

    public int? ExchangeAmount { get; set; }

    [Required(ErrorMessage = "Las notas son requeridas.")]
    [MaxLength(500, ErrorMessage = "Las notas no pueden exceder los 500 caracteres.")]
    public string? Notes { get; set; }
}

public class PrescriptionItemCreateDto
{
    [Required(ErrorMessage = "El medicamento es requerido.")]
    public OptionDto? Product { get; set; }

    [Required(ErrorMessage = "La cantidad es requerida.")]
    [Range(1, 1000, ErrorMessage = "La cantidad debe ser mayor a 0 y menor que 1,000.")]
    public int? Quantity { get; set; }

    [Required(ErrorMessage = "La dosis es requerida.")]
    public double? Dosage { get; set; }

    [Required(ErrorMessage = "Las instrucciones son requeridas.")]
    [MaxLength(500, ErrorMessage = "Las instrucciones no pueden exceder los 500 caracteres.")]
    public string? Instructions { get; set; }

    [Required(ErrorMessage = "Las unidades son requeridas.")]
    public string? Unit { get; set; }
}