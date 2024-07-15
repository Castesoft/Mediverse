namespace MainService.Models.Entities;
public class UserAddress
{
    public int UserId { get; set; }
    public int AddressId { get; set; }
    public AppUser User { get; set; }
    public Address Address { get; set; }

    public bool IsMain { get; set; }
}