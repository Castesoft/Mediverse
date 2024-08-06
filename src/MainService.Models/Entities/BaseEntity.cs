namespace MainService.Models.Entities;

public class BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
