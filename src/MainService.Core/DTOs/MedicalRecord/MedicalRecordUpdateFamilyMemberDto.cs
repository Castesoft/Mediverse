using MainService.Models.Entities.Aggregate;

namespace MainService.Core.DTOs.MedicalRecord;

public class MedicalRecordUpdateFamilyMemberDto
{
    public int? Age { get; set; }
    public string? Name { get; set; }
    public OptionDto? RelativeType { get; set; }
}