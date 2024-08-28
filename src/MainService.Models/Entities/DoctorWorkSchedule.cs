namespace MainService.Models.Entities
{
    public class DoctorWorkSchedule
    {
        public int UserId { get; set; }
        public AppUser User { get; set; }
        public int WorkScheduleId { get; set; }
        public WorkSchedule WorkSchedule { get; set; }
    }
}