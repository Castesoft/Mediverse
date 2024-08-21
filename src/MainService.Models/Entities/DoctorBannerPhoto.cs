namespace MainService.Models.Entities;
public class DoctorBannerPhoto
{
    public AppUser User { get; set; }
    public Photo Photo { get; set; }
    public int UserId { get; set; }
    public int PhotoId { get; set; }

    public DoctorBannerPhoto() { }

    public DoctorBannerPhoto(int userId) => UserId = userId;
}