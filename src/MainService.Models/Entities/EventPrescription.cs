namespace MainService.Models.Entities;

public class EventPrescription
{
    public EventPrescription() { }
    public EventPrescription(int eventId) => EventId = eventId;
    public EventPrescription(Prescription prescription) => Prescription = prescription;
    
    public int EventId { get; set; }
    public int PrescriptionId { get; set; }
    public Event Event { get; set; } = null!;
    public Prescription Prescription { get; set; } = null!;
}