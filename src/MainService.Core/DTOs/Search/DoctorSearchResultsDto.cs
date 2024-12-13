using MainService.Core.DTOs.User;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.DTOs.Search
{
    public class DoctorSearchResultsDto
    {
        public List<DoctorSearchResultDto> Doctors { get; set; } = [];
        public double? Latitude { get; set; } = null;
        public double? Longitude { get; set; } = null;
    }

    public class DoctorSearchResultDto
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Title { get; set; }

        public List<OptionDto> PaymentMethods { get; set; } = [];
        public List<OptionDto> Services { get; set; } = [];
        public List<OptionDto> MedicalInsuranceCompanies { get; set; } = [];
        public List<OptionDto> Specialties { get; set; } = [];

        public List<DoctorClinicDto> Addresses { get; set; } = [];
        public bool RequireAnticipatedCardPayments { get; set; }
        public List<WorkScheduleDto> WorkSchedules { get; set; } = [];
        public List<Event> DoctorEvents { get; set; } = [];
        public List<AvailableDayDto> AvailableDays { get; set; } = [];
        public List<DoctorReviewDto> Reviews { get; set; } = [];
        public string? PhotoUrl { get; set; }
        public List<DoctorPatientDto> Patients { get; set; } = [];
        public bool HasPatientInformationAccess { get; set; }
    }

    public class AvailableDayDto
    {
        public string? Day { get; set; }
        public int DayNumber { get; set; }
        public string? Month { get; set; }
        public int MonthNumber { get; set; }
        public int Year { get; set; }
        public List<AvailableTimeDto> AvailableTimes { get; set; } = [];
    }

    public class AvailableTimeDto
    {
        public string? Start { get; set; }
        public string? End { get; set; }
        public bool Available { get; set; }
    }
}