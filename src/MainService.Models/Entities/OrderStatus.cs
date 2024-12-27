using MainService.Models.Entities.Aggregate;

namespace MainService.Models.Entities
{
    public class OrderStatus : BaseCodeEntity
    {
        public OrderStatus() {}

        public OrderStatus(string code, string text, string description) : base(code, text, description) {}

        public List<OrderOrderStatus> OrderOrderStatuses { get; set; } = [];
    }
}