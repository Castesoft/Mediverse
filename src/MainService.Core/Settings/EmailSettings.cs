namespace MainService.Core.Settings;
public class EmailSettings
{
    public required string FromAddress { get; set; }
    public required string SmtpUser { get; set; }
    public required string SmtpPass { get; set; }
    public required string SmtpHost { get; set; }
    public required int SmtpPort { get; set; }
}