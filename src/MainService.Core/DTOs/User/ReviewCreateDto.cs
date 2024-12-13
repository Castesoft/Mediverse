namespace MainService.Core.DTOs.User
{
    public class ReviewCreateDto
    {
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public int EventId { get; set; }
        public bool IsServiceRecommended { get; set; }
    }
}