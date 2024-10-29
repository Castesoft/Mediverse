using System.Runtime.Serialization;

namespace MainService.Models.Entities
{
    public class Address
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Street { get; set; }
        public string InteriorNumber { get; set; }
        public string ExteriorNumber { get; set; }
        public string Neighborhood { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Zipcode { get; set; }
        public string Notes { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CrossStreet1 { get; set; }
        public string CrossStreet2 { get; set; }

        public ClinicLogo ClinicLogo { get; set; }
        public DoctorClinic DoctorClinic { get; set; }
        public List<EventClinic> EventClinics { get; set; } = [];
        public List<ClinicNurse> ClinicNurses { get; set; } = [];
        public List<OrderAddress> OrderAddresses { get; set; } = [];
        public UserAddress UserAddress { get; set; }
        public List<PrescriptionClinic> PrescriptionClinics { get; set; } = [];

        public double GetLatitude() => Latitude ?? 0;
        public double GetLongitude() => Longitude ?? 0;
    }
    public enum Addresses
    {
        [EnumMember(Value = "Account")]
        Account,
        [EnumMember(Value = "Clinic")]
        Clinic,
    }
}