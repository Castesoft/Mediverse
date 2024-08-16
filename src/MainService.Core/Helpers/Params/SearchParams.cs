namespace MainService.Core.Helpers.Params;
public class SearchParams : BaseParams
{
    public string Specialty { get; set; }
    public string Location { get; set; }
    public double? Latitude { get; set; } = null;
    public double? Longitude { get; set; } = null;
}