namespace MainService.Models.Entities.Addresses;
public class State : BaseEntity
{
    
    public ICollection<StateCity> StateCities { get; set; } = [];
}

/*

un estado muchos zipCodes

un zipCode muchas colonias o asentas

*/