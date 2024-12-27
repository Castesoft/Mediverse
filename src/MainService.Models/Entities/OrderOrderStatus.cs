namespace MainService.Models.Entities
{
    public class OrderOrderStatus
    {
        public OrderOrderStatus() {}

        public OrderOrderStatus(int orderStatusId) => OrderStatusId = orderStatusId;

        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;
        public int OrderStatusId { get; set; }
        public OrderStatus OrderStatus { get; set; } = null!;
    }
}