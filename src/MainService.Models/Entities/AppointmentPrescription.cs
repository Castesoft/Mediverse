namespace MainService.Models.Entities;

public class AppointmentPrescription
{
    public int AppointmentId { get; set; }
    public int PrescriptionId { get; set; }
    public Appointment Appointment { get; set; }
    public Prescription Prescription { get; set; }
}