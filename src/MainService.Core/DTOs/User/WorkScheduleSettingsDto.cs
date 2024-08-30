namespace MainService.Core.DTOs.User
{
    public class WorkScheduleSettingsDto
    {
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int MinutesPerBlock { get; set; }
    }
}