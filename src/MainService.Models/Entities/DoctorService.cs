namespace MainService.Models.Entities;
public class DoctorService
{
    public DoctorService() {}
    
    public DoctorService(AppUser doctor, Service service)
    {
        Doctor = doctor;
        Service = service;
    }

    public DoctorService(Service service) => Service = service;

    public DoctorService(int doctorId, Service service)
    {
        DoctorId = doctorId;
        Service = new(service.Name, service.Description);
    }
    
    public int DoctorId { get; set; }
    public AppUser Doctor { get; set; }
    public int ServiceId { get; set; }
    public Service Service { get; set; }
}