namespace MainService.Models.Entities;
public class StateCity
{
    public int StateId { get; set; }
    public int CityId { get; set; }
    
    public State State { get; set; }
    public City City { get; set; }
}