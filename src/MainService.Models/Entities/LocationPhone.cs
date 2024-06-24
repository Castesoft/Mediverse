namespace MainService.Models.Entities;

public class LocationPhone
{
    public int LocationId { get; set; }
    public int PhoneId { get; set; }
    public Location Location { get; set; }
    public Phone Phone { get; set; }
}