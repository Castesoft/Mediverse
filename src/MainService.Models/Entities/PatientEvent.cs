namespace MainService.Models.Entities;

public class PatientEvent
{
    public int PatientId { get; set; }
    public int EventId { get; set; }
    public AppUser Patient { get; set; }
    public Event Event { get; set; }
}