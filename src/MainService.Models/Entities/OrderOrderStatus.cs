namespace MainService.Models.Entities
{
    public class OrderOrderStatus
    {
        public OrderOrderStatus() {}

        public OrderOrderStatus(int orderStatusId) => OrderStatusId = orderStatusId;
        public OrderOrderStatus(OrderStatus status) => OrderStatus = status;

        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;
        public int OrderStatusId { get; set; }
        public OrderStatus OrderStatus { get; set; } = null!;
    }
}