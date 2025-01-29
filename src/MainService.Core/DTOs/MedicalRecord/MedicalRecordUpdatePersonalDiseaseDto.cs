using MainService.Models.Entities.Aggregate;

namespace MainService.Core.DTOs.MedicalRecord;

public class MedicalRecordUpdatePersonalDiseaseDto
{
    public OptionDto? Disease { get; set; }
    public string? Description { get; set; }
    public string? Other { get; set; }
}