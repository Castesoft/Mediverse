namespace MainService.Core.Helpers.Params;

public class PaymentParams : BaseParams
{
    public int? DoctorId { get; set; }
    public int? EventId { get; set; }
}