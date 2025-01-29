using MainService.Models.Entities.Aggregate;

namespace MainService.Core.DTOs.MedicalRecord;

public class MedicalRecordUpdateFamilyDiseaseDto
{
    public OptionDto? RelativeType { get; set; }
    public DiseaseDto? Disease { get; set; }
    public string? Description { get; set; }
    public string? Other { get; set; }
}