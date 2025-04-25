namespace MainService.Core.Helpers.Params;

public class DoctorNurseParams : BaseParams 
{
    public int? DoctorId { get; set; }
    public int? NurseId { get; set; }
    public string? DoctorName { get; set; }
    public string? NurseName { get; set; }
    public string? DoctorSpecialty { get; set; }
}