using MainService.Core.DTOs.User;

namespace MainService.Controllers;

public class DoctorRegisterFieldsDto
{
    public List<PaymentMethodTypeDto> PaymentMethodTypes { get; set; }
    public List<SpecialtyDto> Specialties { get; set; }
}