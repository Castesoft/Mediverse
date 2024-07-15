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

        public DoctorClinic DoctorClinic { get; set; }
        public ICollection<EventClinic> EventClinics { get; set; } = [];
        public ICollection<ClinicNurse> ClinicNurses { get; set; } = [];
        public UserAddress UserAddress { get; set; }
    }
    public enum Addresses
    {
        [EnumMember(Value = "Account")]
        Account,
        [EnumMember(Value = "Clinic")]
        Clinic,
    }
}