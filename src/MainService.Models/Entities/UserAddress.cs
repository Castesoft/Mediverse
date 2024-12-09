namespace MainService.Models.Entities;
public class UserAddress
{
    public int UserId { get; set; }
    public int AddressId { get; set; }
    public AppUser User { get; set; } = null!;
    public Address Address { get; set; } = null!;

    public bool IsMain { get; set; } = false;
    public bool IsBilling { get; set; } = false;
}