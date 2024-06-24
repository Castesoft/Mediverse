namespace MainService.Models.Entities;
public class Prescription : BaseEntity
{
    // Properties

    // Navigation Properties
    public AppUser Patient { get; set; }
    public AppUser Doctor { get; set; }
    public ICollection<PrescriptionMedicine> PrescriptionMedicines { get; set; } = [];
}