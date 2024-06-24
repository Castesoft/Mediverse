namespace MainService.Models.Entities;

public class DoctorAppointment
{
    public int DoctorId { get; set; }
    public int AppointmentId { get; set; }
    public AppUser Doctor { get; set; }
    public Appointment Appointment { get; set; }
}