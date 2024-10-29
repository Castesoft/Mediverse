namespace MainService.Models.Entities;

public class OrderAddress
{
    public OrderAddress() {}

    public OrderAddress(int addressId) => AddressId = addressId;

    public OrderAddress(int orderId, int addressId)
    {
        OrderId = orderId;
        AddressId = addressId;
    }
    
    public int OrderId { get; set; }
    public int AddressId { get; set; }
    public Order Order { get; set; }
    public Address Address { get; set; }
}