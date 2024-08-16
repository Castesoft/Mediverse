using MainService.Core.DTOs.Addresses;
using MainService.Core.DTOs.User;
using MainService.Core.Helpers.Pagination;

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
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Title { get; set; }
        public SpecialtyDto[] Specialties { get; set; }
        public UserAddressDto[] Addresses { get; set; }
        public string PhotoUrl { get; set; }
    }
}