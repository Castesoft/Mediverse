namespace MainService.Core.Settings;

public class StripeSettings
{
    public string PublishableKey { get; set; }
    public string SecretKey { get; set; }
    public string PriceId { get; set; }
    public string ReturnUrl { get; set; }
    public string RefreshUrl { get; set; }
}