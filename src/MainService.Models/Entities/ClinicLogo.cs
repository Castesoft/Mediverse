namespace MainService.Models.Entities
{
    public class ClinicLogo
    {
        public ClinicLogo()
        {
        }

        public ClinicLogo(int addressId, int photoId)
        {
            AddressId = addressId;
            PhotoId = photoId;
        }

        public ClinicLogo(Photo photo)
        {
            Photo = photo;
        }

        public int AddressId { get; set; }
        public Address Address { get; set; } = null!;
        public int PhotoId { get; set; }
        public Photo Photo { get; set; } = null!;
    }
}