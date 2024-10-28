using MainService.Core.DTOs;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;

public interface IDocumentRepository
{
    Task<Document> GetByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> ExistsByNameAsync(string name);
    Task<List<DocumentDto>> GetAllDtosAsync();
    Task<PagedList<DocumentDto>> GetPagedListAsync(DocumentParams param, bool getAll = false);
    Task<DocumentDto> GetDtoByIdAsync(int id);
    Task<Document> GetAsNoTrackingByIdAsync(int id);
    Task<DocumentDto> FindDtoByNameAsync(string name);
    Task<Document> GetByNameAsync(string name);
    void Add(Document item);
    void Delete(Document item);
}
