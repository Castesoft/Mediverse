namespace MainService.Models.Entities;

public class DoctorSignature
{
    public int DoctorId { get; set; }
    public int SignatureId { get; set; }
    public AppUser Doctor { get; set; } = null!;
    public Photo Signature { get; set; } = null!;
}