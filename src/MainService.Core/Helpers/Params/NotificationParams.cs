namespace MainService.Core.Helpers.Params;

public class NotificationParams : BaseParams
{
    public string? Status { get; set; }
    public int? RequestingUserId { get; set; }
}