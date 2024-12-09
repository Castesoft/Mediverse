namespace MainService.Models.Entities.Addresses;
public class Neighborhood : BaseEntity
{
    // Asentamiento
    public string? Settlement { get; set; }
    public string? Zipcode { get; set; }
    
    public CityNeighborhood CityNeighborhood { get; set; } = null!;
}