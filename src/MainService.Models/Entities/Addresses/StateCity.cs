namespace MainService.Models.Entities.Addresses;
public class StateCity
{
    public int StateId { get; set; }
    public int CityId { get; set; }
    
    public State State { get; set; }
    public City City { get; set; }
}