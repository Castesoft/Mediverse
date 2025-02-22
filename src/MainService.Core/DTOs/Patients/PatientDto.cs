using MainService.Core.DTOs.Events;
using MainService.Core.DTOs.MedicalRecord;
using MainService.Core.DTOs.Payment;
using MainService.Core.DTOs.User;

namespace MainService.Core.DTOs.Patients;
public class PatientDto : BaseUserDto
{
    public int EventsCount { get; set; } = 0;
    public int PrescriptionsCount { get; set; } = 0;
    public int OrdersCount { get; set; } = 0;
    public List<EventDto> DoctorEvents { get; set; } = [];
    public List<PaymentDto> DoctorPayments { get; set; } = [];
    public List<UserMedicalInsuranceCompanyDto> MedicalInsuranceCompanies { get; set; } = [];
    public MedicalRecordDto? MedicalRecord { get; set; }
    public bool HasAccount { get; set; }
}