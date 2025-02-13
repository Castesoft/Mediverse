namespace MainService.Models.Entities
{
    public class ClinicPhoto
    {
        public ClinicPhoto()
        {
        }

        public ClinicPhoto(Photo photo) => Photo = photo;

        public ClinicPhoto(Address clinic, Photo photo)
        {
            Clinic = clinic;
            Photo = photo;
        }

        public ClinicPhoto(int clinicId, int photoId)
        {
            ClinicId = clinicId;
            PhotoId = photoId;
        }

        public int ClinicId { get; set; }
        public Address Clinic { get; set; } = null!;        
        public int PhotoId { get; set; }
        public Photo Photo { get; set; } = null!;
        public bool IsMain { get; set; } = false;
    }
}