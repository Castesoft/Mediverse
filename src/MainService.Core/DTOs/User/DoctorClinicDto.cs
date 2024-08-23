namespace MainService.Core.DTOs.User
{
    public class DoctorClinicDto
    {
        public int Id { get; set; }
        public bool IsMain { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Zipcode { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}