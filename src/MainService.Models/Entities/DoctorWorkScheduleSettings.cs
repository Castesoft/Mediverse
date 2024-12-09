namespace MainService.Models.Entities
{
    public class DoctorWorkScheduleSettings
    {
        public int UserId { get; set; }
        public AppUser User { get; set; } = null!;
        public int WorkScheduleSettingsId { get; set; }
        public WorkScheduleSettings WorkScheduleSettings { get; set; } = null!;
    }
}