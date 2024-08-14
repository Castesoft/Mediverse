namespace MainService.Models.Entities.Addresses;
public class City : BaseEntity
{
    
    public StateCity StateCity { get; set; }
    public ICollection<CityNeighborhood> CityNeighborhoods { get; set; } = [];
}