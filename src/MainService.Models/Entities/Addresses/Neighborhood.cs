namespace MainService.Models.Entities;
public class Neighborhood : BaseEntity
{
    // Asentamiento
    public string Settlement { get; set; }
    public string Zipcode { get; set; }
    
    public CityNeighborhood CityNeighborhood { get; set; }
}