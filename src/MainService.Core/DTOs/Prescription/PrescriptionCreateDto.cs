using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.Prescription;

public class PrescriptionCreateDto
{
    public List<PrescriptionItemCreateDto> PrescriptionItems { get; } = [];
    
    [Required(ErrorMessage = "PatientId is required")]
    public int PatientId { get; }
    
    public int? EventId { get; }
    public int? ExchangeAmount { get; }
}