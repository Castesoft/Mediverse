namespace MainService.Core.Settings;
public class EmailSettings
{
    public string FromAddress { get; set; }
    public string SmtpUser { get; set; }
    public string SmtpPass { get; set; }
    public string SmtpHost { get; set; }
    public int SmtpPort { get; set; }
}