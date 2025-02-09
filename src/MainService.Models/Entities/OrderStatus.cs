
namespace MainService.Models.Entities
{
    public class OrderStatus : BaseCodeEntity
    {
        public OrderStatus()
        {
        }

        public OrderStatus(string text) : base(text)
        {
        }

        public OrderStatus(int codeNumber) : base(codeNumber)
        {
        }

        public OrderStatus(int codeNumber, string text) : base(codeNumber, text)
        {
        }

        public OrderStatus(string code, string text) : base(code, text)
        {
        }

        public OrderStatus(int codeNumber, string name, string description) : base(codeNumber, name, description)
        {
        }

        public OrderStatus(string code, string name, string description) : base(code, name, description)
        {
        }

        public OrderStatus(string code, string text, bool visible) : base(code, text, visible)
        {
        }

        public OrderStatus(string code, string name, string description, bool enabled, bool visible) : base(code, name, description, enabled, visible)
        {
        }

        public List<OrderOrderStatus> OrderOrderStatuses { get; set; } = [];
    }
}