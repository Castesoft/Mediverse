namespace MainService.Models.Entities
{
    public class ClinicLogo
    {
        public int AddressId { get; set; }
        public Address Address { get; set; } = null!;
        public int PhotoId { get; set; }
        public Photo Photo { get; set; } = null!;
    }
}