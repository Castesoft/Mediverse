namespace MainService.Models.Entities;

public class PatientAppointment
{
    public int PatientId { get; set; }
    public int AppointmentId { get; set; }
    public AppUser Patient { get; set; }
    public Appointment Appointment { get; set; }
}