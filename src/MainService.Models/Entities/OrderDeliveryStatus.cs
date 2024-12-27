namespace MainService.Models.Entities
{
    public class OrderDeliveryStatus
    {
        public OrderDeliveryStatus() {}

        public OrderDeliveryStatus(int deliveryStatusId) => DeliveryStatusId = deliveryStatusId;

        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;
        public int DeliveryStatusId { get; set; }
        public DeliveryStatus DeliveryStatus { get; set; } = null!;
    }
}