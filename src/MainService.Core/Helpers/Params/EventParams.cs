using MainService.Models.Entities;

namespace MainService.Core.Helpers.Params;

public class EventParams : BaseParams
{
    public Roles? Role { get; set; }
    public string? Patients { get; set; }
    public string? Services { get; set; }
    public string? Nurses { get; set; }
    public int? ServiceId { get; set; }
    public int? DoctorId { get; set; }
    public int? NurseId { get; set; }
    public int? PatientId { get; set; }
    public int? UserId { get; set; }
    public bool? IsCalendarView { get; set; }
    public List<int> GetNurses() => Nurses?.Split(',').Select(int.Parse).ToList() ?? [];
    public List<int> GetPatients() => Patients?.Split(',').Select(int.Parse).ToList() ?? [];
    public List<int> GetServices() => Services?.Split(',').Select(int.Parse).ToList() ?? [];
}