using MainService.Core.DTOs.Addresses;
using MainService.Core.DTOs.Services;
using MainService.Core.DTOs.User;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;

namespace MainService.Core.DTOs.Search
{
    public class DoctorSearchResultsDto
    {
        public ICollection<DoctorSearchResultDto> Doctors { get; set; }
        public double? Latitude { get; set; } = null;
        public double? Longitude { get; set; } = null;
    }

    public class DoctorSearchResultDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Title { get; set; }
        public SpecialtyDto[] Specialties { get; set; }
        public DoctorClinicDto[] Addresses { get; set; }
        public PaymentMethodTypeDto[] PaymentMethods { get; set; }
        public bool RequireAnticipatedCardPayments { get; set; }
        public ServiceDto[] Services { get; set; }
        public MedicalInsuranceCompanyDto[] MedicalInsuranceCompanies { get; set; }
        public string PhotoUrl { get; set; }
    }
}