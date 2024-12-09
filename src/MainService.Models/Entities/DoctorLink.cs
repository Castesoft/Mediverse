namespace MainService.Models.Entities;

public class DoctorLink
{
    public int DoctorId { get; set; }
    public int LinkId { get; set; }
    public AppUser Doctor { get; set; } = null!;
    public Link Link { get; set; } = null!;
}