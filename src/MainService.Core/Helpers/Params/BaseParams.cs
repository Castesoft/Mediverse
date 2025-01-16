using MainService.Core.Helpers.Pagination;

namespace MainService.Core.Helpers.Params;
public class BaseParams : PaginationParams
{
    public string? Sort { get; set; }
    // admin, landing, home 
    public string? FromSection { get; set; }
    public bool? IsSortAscending { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    private string? _search;
    public string? Search
    {
        get => _search;
        set => _search = value?.ToLower();
    }
}