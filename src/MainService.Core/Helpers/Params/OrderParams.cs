namespace MainService.Core.Helpers.Params;

public class OrderParams : BaseParams
{
    public int? DoctorId { get; set; }
    public IEnumerable<string> DoctorRole { get; set; } = [];
}