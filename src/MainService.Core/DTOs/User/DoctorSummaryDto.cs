namespace MainService.Core.DTOs.User;

public class DoctorSummaryDto : BaseUserDto
{
    public List<UserMedicalLicenseDto> MedicalLicenses { get; set; }
}