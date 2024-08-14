namespace MainService.Models.Entities;
public class City : BaseEntity
{
    
    public StateCity StateCity { get; set; }
    public ICollection<CityNeighborhood> CityNeighborhoods { get; set; } = [];
}