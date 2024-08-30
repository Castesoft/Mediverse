namespace MainService.Models.Entities
{
    public class UserReview
    {
        public int UserId { get; set; }
        public AppUser User { get; set; }
        public int ReviewId { get; set; }
        public Review Review { get; set; }
    }
}