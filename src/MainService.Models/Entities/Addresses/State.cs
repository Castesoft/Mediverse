namespace MainService.Models.Entities;
public class State : BaseEntity
{
    
    public ICollection<StateCity> StateCities { get; set; } = [];
}