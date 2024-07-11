namespace MainService.Models.Entities;

public class Event : BaseEntity
{
    public AppUser Patient { get; set; }
    public DateTime Date { get; set; }
    public Service Service { get; set; }
    public DoctorEvent DoctorEvent { get; set; }
    public PatientEvent PatientEvent { get; set; }
    public ICollection<EventPrescription> EventPrescriptions { get; set; } = [];
}