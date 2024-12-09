namespace MainService.Models.Entities
{
    public class DoctorWorkSchedule
    {
        public int UserId { get; set; }
        public AppUser User { get; set; } = null!;
        public int WorkScheduleId { get; set; }
        public WorkSchedule WorkSchedule { get; set; } = null!;
    }
}