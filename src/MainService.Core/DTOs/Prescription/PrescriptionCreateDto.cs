using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.Prescription;

public class PrescriptionCreateDto
{
    public List<PrescriptionItemCreateDto> PrescriptionItems { get; set; } = [];
    
    [Required(ErrorMessage = "PatientId is required")]
    public int PatientId { get; set; }
    
    public int? EventId { get; set; }
    public int? ExchangeAmount { get; set; }
}