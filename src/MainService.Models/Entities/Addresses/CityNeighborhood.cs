namespace MainService.Models.Entities;
public class CityNeighborhood
{
    public int CityId { get; set; }
    public int NeighborhoodId { get; set; }
    
    public City City { get; set; }
    public Neighborhood Neighborhood { get; set; }
}