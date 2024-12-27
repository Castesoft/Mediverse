

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
            OrderStatus? orderStatus = await context.OrderStatuses.SingleOrDefaultAsync(x => x.Name == "Pendiente");
            DeliveryStatus? deliveryStatus = await context.DeliveryStatuses.SingleOrDefaultAsync(x => x.Name == "Pendiente");

            if (orderStatus == null || deliveryStatus == null)
            {
                throw new Exception("OrderStatus or DeliveryStatus not found");
            }
            
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
                OrderItems = [],
                OrderOrderStatus = new(orderStatus.Id),
                OrderDeliveryStatus = new(deliveryStatus.Id),
            };

            int? addressId = await context.UserAddresses
                .Where(x => x.UserId == customerId && x.IsMain)
                .Select(x => x.AddressId)
                .SingleOrDefaultAsync()
            ;

            if (addressId.HasValue) order.OrderDeliveryAddress = new (addressId.Value);
            else order.OrderDeliveryAddress = null!;

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