namespace MainService.Models.Entities;

public class EventService
{
    public EventService() {}
    
    public EventService(int serviceId) => ServiceId = serviceId;
    
    public int EventId { get; set; }
    public int ServiceId { get; set; }
    public Event Event { get; set; }
    public Service Service { get; set; }
}