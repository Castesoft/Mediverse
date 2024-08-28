namespace MainService.Core.DTOs.User
{
    public class WorkScheduleDto
    {
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public int DayOfWeek { get; set; }
    }
}