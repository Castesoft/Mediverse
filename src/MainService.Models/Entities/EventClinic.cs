namespace MainService.Models.Entities;

public class EventClinic
{
    public EventClinic() {}
    
    public EventClinic(int clinicId) => ClinicId = clinicId;
    public EventClinic(Address clinic) => Clinic = clinic;
    
    public int EventId { get; set; }
    public int ClinicId { get; set; }
    public Event Event { get; set; } = null!;
    public Address Clinic { get; set; } = null!;
}