namespace MainService.Core.DTOs.DoctorNurses;

public class DoctorNurseDto
{
    public int DoctorId { get; set; }
    public int NurseId { get; set; }
    public string? DoctorName { get; set; }
    public string? DoctorEmail { get; set; }
    public string? DoctorPhotoUrl { get; set; }
    public string? DoctorSpecialty { get; set; }
    public string? NurseName { get; set; }
    public string? NurseEmail { get; set; }
    public string? NursePhotoUrl { get; set; }
    public DateTime AssociationDate { get; set; }
}