namespace MainService.Models.Entities;
public class ServicePhoto
{
    public int ServiceId { get; set; }
    public int PhotoId { get; set; }
    
    public Service Service { get; set; } = null!;
    public Photo Photo { get; set; } = null!;
}