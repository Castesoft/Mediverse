namespace MainService.Models.Entities;

public class OrderPickupAddress
{
    public OrderPickupAddress() {}

    public OrderPickupAddress(int addressId) => AddressId = addressId;

    public OrderPickupAddress(int orderId, int addressId)
    {
        OrderId = orderId;
        AddressId = addressId;
    }
    
    public int OrderId { get; set; }
    public int AddressId { get; set; }
    public Order Order { get; set; } = null!;
    public Address PickupAddress { get; set; } = null!;
}