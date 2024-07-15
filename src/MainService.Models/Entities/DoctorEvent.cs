namespace MainService.Models.Entities;

public class DoctorEvent
{
    public DoctorEvent() {}
    
    public DoctorEvent(int doctorId) => DoctorId = doctorId;
    
    public int DoctorId { get; set; }
    public int EventId { get; set; }
    public AppUser Doctor { get; set; }
    public Event Event { get; set; }
}