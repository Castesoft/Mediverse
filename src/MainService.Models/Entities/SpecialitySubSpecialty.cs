namespace MainService.Models.Entities;
public class SpecialitySubSpecialty
{
    public int SpecialtyId { get; set; }
    public int SubSpecialtyId { get; set; }
    public Specialty Specialty { get; set; }
    public SubSpecialty SubSpecialty { get; set; }
}