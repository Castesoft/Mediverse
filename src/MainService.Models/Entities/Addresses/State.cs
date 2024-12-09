namespace MainService.Models.Entities.Addresses;
public class State : BaseEntity
{
    public List<StateCity> StateCities { get; set; } = [];
}