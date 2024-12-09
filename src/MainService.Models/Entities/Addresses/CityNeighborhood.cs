namespace MainService.Models.Entities.Addresses;
public class CityNeighborhood
{
    public int CityId { get; set; }
    public int NeighborhoodId { get; set; }
    
    public City City { get; set; } = null!;
    public Neighborhood Neighborhood { get; set; } = null!;
}