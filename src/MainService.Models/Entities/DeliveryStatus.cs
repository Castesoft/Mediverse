using MainService.Models.Entities.Aggregate;

namespace MainService.Models.Entities
{
    public class DeliveryStatus : BaseCodeEntity
    {
        public DeliveryStatus() {}

        public DeliveryStatus(string code, string text, string description) : base(code, text, description) {}

        public List<OrderDeliveryStatus> OrderDeliveryStatuses { get; set; } = [];
    }
}