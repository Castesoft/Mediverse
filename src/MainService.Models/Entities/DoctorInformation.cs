namespace MainService.Models.Entities;

public class DoctorInformation
{
    public int DoctorId { get; set; }
    public int InformationId { get; set; } 
    public AppUser Doctor { get; set; }
    public SpecialistSpecification Information { get; set; }
}