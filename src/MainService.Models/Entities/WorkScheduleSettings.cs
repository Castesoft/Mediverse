namespace MainService.Models.Entities
{
    public class WorkScheduleSettings : BaseEntity
    {
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int MinutesPerBlock { get; set; }
    }
}