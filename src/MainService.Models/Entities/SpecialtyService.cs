namespace MainService.Models.Entities;
public class SpecialtyService
{
    public int SpecialtyId { get; set; }
    public int ServiceId { get; set; }
    public Specialty Specialty { get; set; } = null!;
    public Service Service { get; set; } = null!;
}