

namespace MainService.Core.Helpers.Params;
public class SearchParams : BaseParams
{
    public int? SpecialtyId { get; set; } = null;
    public string? Specialty { get; set; } = null;
    public string? SpecialtyIds { get; set; } = null;
    public string? Location { get; set; } = null;
    public double? Latitude { get; set; } = null;
    public double? Longitude { get; set; } = null;
    public int? PatientId { get; set; } = null;
    public int? DoctorId { get; set; } = null;
    public string? DoctorFullName { get; set; } = null;

    public List<int> GetSpecialtyIds() => string.IsNullOrEmpty(SpecialtyIds) ? [] : SpecialtyIds.Split(',').Select(int.Parse).ToList();
}