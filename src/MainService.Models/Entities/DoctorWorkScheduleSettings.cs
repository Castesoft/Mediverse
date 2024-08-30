namespace MainService.Models.Entities
{
    public class DoctorWorkScheduleSettings
    {
        public int UserId { get; set; }
        public AppUser User { get; set; }
        public int WorkScheduleSettingsId { get; set; }
        public WorkScheduleSettings WorkScheduleSettings { get; set; }
    }
}