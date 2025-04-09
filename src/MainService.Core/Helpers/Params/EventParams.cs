using MainService.Models.Entities;

namespace MainService.Core.Helpers.Params;

public enum CalendarPeriodType
{
    Current,
    Previous,
    Next,
    Custom
}

public class EventParams : BaseParams
{
    // Existing filtering properties.
    public Roles? Role { get; set; }
    public string? Patients { get; set; }
    public string? Services { get; set; }
    public string? Nurses { get; set; }
    public string? Clinics { get; set; }
    public string? Sexes { get; set; }

    public int? ServiceId { get; set; }
    public int? DoctorId { get; set; }
    public int? NurseId { get; set; }
    public int? PatientId { get; set; }
    public int? UserId { get; set; }
    public int? AuthenticatedUserId { get; set; }
    public bool? IsCalendarView { get; set; }
    public bool? FromAccountRoute { get; set; }

    // ============================================================
    // New properties for calendar-specific filtering:
    public CalendarPeriodType? CalendarPeriod { get; set; }
    public DateTime? CustomStartDate { get; set; }
    public DateTime? CustomEndDate { get; set; }

    public int? Month { get; set; }
    public int? Year { get; set; }
    public int? MaxEventsPerDay { get; set; }

    // ============================================================
    // Helper methods for converting comma-separated strings into lists of integers.
    public List<int> GetNurses() => Nurses?.Split(',').Select(int.Parse).ToList() ?? [];
    public List<int> GetPatients() => Patients?.Split(',').Select(int.Parse).ToList() ?? [];
    public List<int> GetServices() => Services?.Split(',').Select(int.Parse).ToList() ?? [];
    public List<int> GetClinics() => Clinics?.Split(',').Select(int.Parse).ToList() ?? [];
    public List<string> GetSexes() => Sexes?.Split(',').Select(s => s.Trim()).ToList() ?? [];
}