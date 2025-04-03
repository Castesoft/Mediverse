using MainService.Core.DTOs.Addresses;
using MainService.Core.DTOs.Patients;
using MainService.Core.DTOs.Payment;
using MainService.Core.DTOs.Prescription;
using MainService.Core.DTOs.Services;
using MainService.Core.DTOs.User;
using MainService.Models.Entities;

namespace MainService.Core.DTOs.Events;

public class EventDto
{
    public int Id { get; set; }
    public bool AllDay { get; set; }
    public DateTime CreatedAt { get; set; }
    public AddressDto? Clinic { get; set; }
    public DoctorDto? Doctor { get; set; }
    public ServiceDto? Service { get; set; }
    public PatientDto? Patient { get; set; }
    public List<UserDto> Nurses { get; set; } = [];
    public decimal? AmountPaid { get; set; }
    public decimal? AmountDue { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public PaymentMethodTypeDto? PaymentMethodType { get; set; }
    public MedicalInsuranceCompanyDto? MedicalInsuranceCompany { get; set; }
    public List<EventPrescriptionDto> Prescriptions { get; set; } = [];
    public List<PaymentDto> Payments { get; set; } = [];
    public string? Evolution { get; set; }
    public string? NextSteps { get; set; }
    public string PaymentStatus { get; set; } = string.Empty;
}

public class EventUpdateDto
{
    public string? Evolution { get; set; }
    public string? NextSteps { get; set; }
}