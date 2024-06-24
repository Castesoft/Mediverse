namespace MainService.Models.Entities;

public class Link : BaseEntity
{
    public string Url { get; set; }
    public string SiteName { get; set; }
    public DoctorLink DoctorLink { get; set; }
}