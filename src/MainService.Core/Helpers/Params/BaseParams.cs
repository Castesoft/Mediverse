using MainService.Core.Helpers.Pagination;

namespace MainService.Core.Helpers.Params;
public class BaseParams : PaginationParams
{
    public string Sort { get; set; }
    private string _search;
    public bool IsSortAscending { get; set; }
    public DateTime DateFrom { get; set; } = DateTime.MinValue;
    public DateTime DateTo { get; set; } = DateTime.MaxValue;
    public string Search
    {
        get => _search;
        set => _search = value.ToLower();
    }
}