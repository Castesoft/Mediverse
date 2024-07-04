namespace MainService.Models.Entities;
    public class UserPhoto
    {
        public AppUser User { get; set; }
        public Photo Photo { get; set; }
        public int UserId { get; set; }
        public int PhotoId { get; set; }

        public UserPhoto(){}

        public UserPhoto(int userId) => UserId = userId;
    }