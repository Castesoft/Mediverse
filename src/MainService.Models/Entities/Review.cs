namespace MainService.Models.Entities
{
    public class Review : BaseEntity
    {
        public string Content { get; set; }
        public int Rating { get; set; }
        public DoctorReview DoctorReview { get; set; }
        public UserReview UserReview { get; set; }
    }
}