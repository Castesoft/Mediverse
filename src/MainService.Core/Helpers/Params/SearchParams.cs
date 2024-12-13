

namespace MainService.Core.Helpers.Params;
public class SearchParams : BaseParams
{
    public int? SpecialtyId { get; set; }
    public string? Specialty { get; set; }
    public string? SpecialtyIds { get; set; }
    public string? Location { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public int? PatientId { get; set; }
    public int? DoctorId { get; set; }
    public string? DoctorFullName { get; set; }

    public List<int> GetSpecialtyIds() => string.IsNullOrEmpty(SpecialtyIds) ? [] : SpecialtyIds.Split(',').Select(int.Parse).ToList();
}