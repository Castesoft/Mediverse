namespace MainService.Models.Entities;
public class UserPhoto
{
    public AppUser User { get; set; } = null!;
    public Photo Photo { get; set; } = null!;
    public int UserId { get; set; }
    public int PhotoId { get; set; }

    public UserPhoto() { }

    public UserPhoto(int userId) => UserId = userId;
}