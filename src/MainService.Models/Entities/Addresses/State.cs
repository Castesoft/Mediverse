namespace MainService.Models.Entities;
public class State : BaseEntity
{
    
    public List<StateCity> StateCities { get; set; } = [];
}