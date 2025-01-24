namespace MainService.Core.DTOs;
public class PhotoDto
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public string? Url { get; set; }
    public string? PublicId { get; set; }
    public string? Name { get; set; }
    public bool IsMain { get; set; }
    public int Size { get; set; }
}