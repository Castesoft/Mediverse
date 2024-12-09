namespace MainService.Models.Entities
{
    public class DoctorReview
    {
        public int DoctorId { get; set; }
        public AppUser Doctor { get; set; } = null!;
        public int ReviewId { get; set; }
        public Review Review { get; set; } = null!;
    }
}