namespace MainService.Core.DTOs.User
{
    public class SatisfactionSurveyDto
    {
        public int EventId { get; set; }
        public string DoctorName { get; set; }
        public string ServiceName { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
    }
}