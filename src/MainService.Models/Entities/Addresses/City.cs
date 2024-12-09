namespace MainService.Models.Entities.Addresses;
public class City : BaseEntity
{
    public StateCity StateCity { get; set; } = null!;
    public List<CityNeighborhood> CityNeighborhoods { get; set; } = [];
}