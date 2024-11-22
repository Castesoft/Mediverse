namespace MainService.Models.Entities;
public class City : BaseEntity
{
    
    public StateCity StateCity { get; set; }
    public List<CityNeighborhood> CityNeighborhoods { get; set; } = [];
}