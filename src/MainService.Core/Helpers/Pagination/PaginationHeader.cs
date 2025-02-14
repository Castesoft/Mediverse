namespace MainService.Core.Helpers.Pagination;
public class PaginationHeader(int currentPage, int itemsPerPage, int totalCount, int totalPages)
{
    public int CurrentPage { get; set; } = currentPage;
    public int ItemsPerPage { get; set; } = itemsPerPage;
    public int TotalCount { get; set; } = totalCount;
    public int TotalPages { get; set; } = totalPages;
}