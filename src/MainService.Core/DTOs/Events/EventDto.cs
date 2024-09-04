using MainService.Core.DTOs.Addresses;
using MainService.Core.DTOs.Services;
using MainService.Core.DTOs.User;
using MainService.Models.Entities;

namespace MainService.Core.DTOs.Events;

public class EventDto
{
    public int Id { get; set; }
    public bool AllDay { get; set; }
    public DateTime CreatedAt { get; set; }
    public AddressDto Clinic { get; set; }
    public DoctorDto Doctor { get; set; }
    public ServiceDto Service { get; set; }
    public UserDto Patient { get; set; }
    public List<UserDto> Nurses { get; set; }
    public DateTime DateFrom { get; set; }
    public DateTime DateTo { get; set; }
    public PaymentMethodTypeDto PaymentMethodType { get; set; }
    public MedicalInsuranceCompanyDto MedicalInsuranceCompany { get; set; }
    public List<PaymentDto> Payments { get; set; }
}