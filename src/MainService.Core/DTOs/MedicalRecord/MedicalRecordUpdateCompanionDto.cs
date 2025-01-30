using MainService.Models.Entities.Aggregate;

namespace MainService.Core.DTOs.MedicalRecord;

public class MedicalRecordUpdateCompanionDto
{
    public int? Age { get; set; }
    public string? Name { get; set; }
    public OptionDto? Sex { get; set; }
    public string? Address { get; set; }
    public string? HomeNumber { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public OptionDto? RelativeType { get; set; }
    public OptionDto? Occupation { get; set; }
}