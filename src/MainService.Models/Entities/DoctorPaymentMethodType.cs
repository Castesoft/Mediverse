namespace MainService.Models.Entities;
public class DoctorPaymentMethodType
{
    public int DoctorId { get; set; }
    public int PaymentMethodTypeId { get; set; }
    public AppUser Doctor { get; set; }
    public PaymentMethodType PaymentMethodType { get; set; }
}