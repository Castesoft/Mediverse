namespace MainService.Core.DTOs.User
{
    public class WorkScheduleUpdateDto
    {
        public List<string> WorkScheduleBlocks { get; set; } = [];
        public string? StartTime { get; set; }
        public string? EndTime { get; set; }
        public int MinutesPerBlock { get; set; }
    }
}