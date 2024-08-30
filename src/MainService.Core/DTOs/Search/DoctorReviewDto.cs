namespace MainService.Core.DTOs.Search
{
    public class DoctorReviewDto
    {
        public int Rating { get; set; }
        public string Comment { get; set; }
        public string UserName { get; set; }
        public string UserPhotoUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}