namespace MainService.Core.Helpers.Params;

public class OrderParams : BaseParams
{
    public int? DoctorId { get; set; }
    public int? PatientId { get; set; }
    public int? RequestingUserId { get; set; }
    public IEnumerable<string> RequestingUserRole { get; set; } = [];
}