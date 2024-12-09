namespace MainService.Core.Settings;
public class TwilioSettings
{
    public required string AccountSID { get; set; }
    public required string AuthToken { get; set; }
    public required string PhoneNumber { get; set; }
}