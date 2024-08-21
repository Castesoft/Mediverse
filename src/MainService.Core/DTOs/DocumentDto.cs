using MainService.Models.Entities;

namespace MainService.Core.DTOs;
public class DocumentDto : BaseEntity
{
    public string Url { get; set; }
    public string PublicId { get; set; }
    public int Size { get; set; }
}