namespace MainService.Models.Entities
{
    public class OrderDeliveryStatus
    {
        public OrderDeliveryStatus() {}

        public OrderDeliveryStatus(int deliveryStatusId) => DeliveryStatusId = deliveryStatusId;
        public OrderDeliveryStatus(DeliveryStatus status) => DeliveryStatus = status;

        public OrderDeliveryStatus(Order order, DeliveryStatus deliveryStatus)
        {
            Order = order;
            DeliveryStatus = deliveryStatus;
        }

        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;
        public int DeliveryStatusId { get; set; }
        public DeliveryStatus DeliveryStatus { get; set; } = null!;
    }
}