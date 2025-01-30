namespace MainService.Models.Entities;

public class OrderDeliveryAddress
{
    public OrderDeliveryAddress() {}

    public OrderDeliveryAddress(int addressId) => AddressId = addressId;

    public OrderDeliveryAddress(int orderId, int addressId)
    {
        OrderId = orderId;
        AddressId = addressId;
    }
    public OrderDeliveryAddress(Address address, Order order)
    {
        DeliveryAddress = address;
        Order = order;
    }
    public OrderDeliveryAddress(Address address) => DeliveryAddress = address;
    
    public int OrderId { get; set; }
    public int AddressId { get; set; }
    public Order Order { get; set; } = null!;
    public Address DeliveryAddress { get; set; } = null!;
}