using MainService.Core.DTOs.Addresses;
using MainService.Core.DTOs.Patients;
using MainService.Core.DTOs.User;

namespace MainService.Core.DTOs.Prescription;

public class EventPrescriptionDto
{
    public int Id { get; set; }
    public int? ExchangeAmount { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public AddressDto? Clinic { get; set; }
    public PatientDto? Patient { get; set; }
    public DoctorDto? Doctor { get; set; }
    public List<PrescriptionItemDto> Items { get; set; } = [];
    public string? LogoUrl { get; set; }
}