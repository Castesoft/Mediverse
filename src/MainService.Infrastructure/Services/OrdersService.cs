

using MainService.Core.Interfaces.Services;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Services
{
    public class OrdersService(DataContext context) : IOrdersService
    {
        public async Task<Order> CreateAsync(List<OrderItem> items, int customerId, int doctorId)
        {
            Order order = new()
            {
                PatientOrder = new(customerId),
                DoctorOrder = new(doctorId),

                Total = 0,
                Subtotal = 0,
                Discount = 0,
                Tax = 0,
                AmountPaid = 0,
                AmountDue = 0,
                PrescriptionOrder = null!,
                OrderAddress = null!,
                OrderItems = [],
                Status = OrderStatus.Pending,
                DeliveryStatus = OrderDeliveryStatus.Pending
            };

            int? addressId = await context.UserAddresses
                .Where(x => x.UserId == customerId && x.IsMain)
                .Select(x => x.AddressId)
                .SingleOrDefaultAsync()
            ;

            if (addressId.HasValue) order.OrderAddress = new (addressId.Value);

            foreach (OrderItem orderItem in items)
            {
                order.OrderItems.Add(orderItem);
                order.Subtotal += orderItem.Item.Price * orderItem.Quantity;
            }

            foreach (OrderItem orderItem in order.OrderItems)
            {
                orderItem.Item = null!;
            }

            order.Tax = order.Subtotal * (decimal)0.16;
            order.Total = order.Subtotal + order.Tax;

            return order;
        }
    }
}