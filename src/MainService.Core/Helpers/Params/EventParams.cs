using MainService.Models.Entities;

namespace MainService.Core.Helpers.Params;
public class EventParams : BaseParams
{
    public int? PatientId { get; set; }
    public string? Patients { get; set; }
    public List<int> GetPatients() => Patients?.Split(',').Select(int.Parse).ToList() ?? [];
    public bool? IsCalendarView { get; set; }
    public Roles? Role { get; set; }
    public int? DoctorId { get; set; }
    public int? ServiceId { get; set; }
    public string? Services { get; set; }
    public List<int> GetServices() => Services?.Split(',').Select(int.Parse).ToList() ?? [];
    public int? NurseId { get; set; }
    public string? Nurses { get; set; }
    public List<int> GetNurses() => Nurses?.Split(',').Select(int.Parse).ToList() ?? [];
}