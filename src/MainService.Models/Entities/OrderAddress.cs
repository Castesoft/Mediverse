namespace MainService.Models.Entities;

public class OrderAddress
{
    public int OrderId { get; set; }
    public int AddressId { get; set; }
    public Order Order { get; set; }
    public Address Address { get; set; }
}