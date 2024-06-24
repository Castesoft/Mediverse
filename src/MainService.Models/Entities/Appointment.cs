namespace MainService.Models.Entities;

public class Appointment : BaseEntity
{
    public AppUser Patient { get; set; }
    public DateTime Date { get; set; }
    public Service Service { get; set; }
    public DoctorAppointment DoctorAppointment { get; set; }
    public PatientAppointment PatientAppointment { get; set; }
    public ICollection<AppointmentPrescription> AppointmentPrescriptions { get; set; } = [];
}