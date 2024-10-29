namespace MainService.Models.Entities;

public class EventPrescription
{
    public EventPrescription() { }
    public EventPrescription(int eventId) => EventId = eventId;
    
    public int EventId { get; set; }
    public int PrescriptionId { get; set; }
    public Event Event { get; set; }
    public Prescription Prescription { get; set; }
}