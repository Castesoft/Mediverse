namespace MainService.Models.Entities
{
    public class WorkSchedule : BaseEntity
    {
        public int DayOfWeek { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public DoctorWorkSchedule DoctorWorkSchedule { get; set; }
    }
}