namespace MainService.Core.DTOs.MedicalRecord;

public class MedicalRecordUpdatePersonalSubstanceDto
{
    public SubstanceDto? Substance { get; set; }
    public ConsumptionLevelDto? ConsumptionLevel { get; set; }
    public int? StartAge { get; set; }
    public int? EndAge { get; set; }
    public bool? IsCurrent { get; set; }
    public string? Other { get; set; }
}