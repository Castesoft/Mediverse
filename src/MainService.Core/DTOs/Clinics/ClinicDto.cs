namespace MainService.Core.DTOs.Clinics
{
    public class ClinicDto
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Description { get; set; }
        public int? NursesCount { get; set; }
        public bool IsMain { get; set; }
        public string? Name { get; set; }
        public string? Street { get; set; }
        public string? InteriorNumber { get; set; }
        public string? ExteriorNumber { get; set; }
        public string? Neighborhood { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? Zipcode { get; set; }
        public string? PhotoUrl { get; set; }
        public List<PhotoDto> Photos { get; set; } = [];
    }
}