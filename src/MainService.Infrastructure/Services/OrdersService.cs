using MainService.Core.DTOs.Orders;
using MainService.Core.Helpers;
using MainService.Core.Interfaces.Services;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Services
{
    public class OrdersService(DataContext context, IUnitOfWork uow) : IOrdersService
    {
        private const string Subject = "orden";
        private const string SubjectArticle = "La";

        public async Task<Order> CreateAsync(List<OrderItem> items, int customerId, int doctorId)
        {
            var orderStatus = await context.OrderStatuses.SingleOrDefaultAsync(x => x.Name == "Pendiente");
            var deliveryStatus = await context.DeliveryStatuses.SingleOrDefaultAsync(x => x.Name == "Pendiente");

            if (orderStatus == null || deliveryStatus == null)
            {
                throw new Exception("OrderStatus or DeliveryStatus not found");
            }

            Order order = new()
            {
                PatientOrder = new PatientOrder(customerId),
                DoctorOrder = new DoctorOrder(doctorId),

                Total = 0,
                Subtotal = 0,
                Discount = 0,
                Tax = 0,
                AmountPaid = 0,
                AmountDue = 0,
                PrescriptionOrder = null!,
                OrderItems = [],
                OrderOrderStatus = new OrderOrderStatus(orderStatus.Id),
                OrderDeliveryStatus = new OrderDeliveryStatus(deliveryStatus.Id),
            };

            int? addressId = await context.UserAddresses
                .Where(x => x.UserId == customerId && x.IsMain)
                .Select(x => x.AddressId)
                .SingleOrDefaultAsync();

            if (addressId.HasValue) {
                order.OrderDeliveryAddress = new OrderDeliveryAddress(addressId.Value);
            }

            foreach (var orderItem in items)
            {
                order.OrderItems.Add(orderItem);
                order.Subtotal += orderItem.Item.Price * orderItem.Quantity;
            }

            foreach (var orderItem in order.OrderItems)
            {
                orderItem.Item = null!;
            }

            order.Tax = order.Subtotal * (decimal)0.16;
            order.Total = order.Subtotal + order.Tax;

            return order;
        }

        public async Task<OrderDto?> UpdateAsync(OrderUpdateDto request, int orderId, int userId)
        {
            if (request.DeliveryStatus?.Id == null) throw new BadRequestException("El estado de entrega es requerido");
            if (request.Status?.Id == null) throw new BadRequestException("El estado es requerido");

            var order = await uow.OrderRepository.GetByIdAsync(orderId);
            if (order == null) throw new NotFoundException($"{SubjectArticle} {Subject} no existe");

            await UpdateOrderDeliveryStatus(order, request.DeliveryStatus.Id.Value, userId);
            await UpdateOrderOrderStatus(order, request.Status.Id.Value, userId);

            if (!uow.HasChanges())
                return await uow.OrderRepository.GetDtoByIdAsync(orderId);

            if (!await uow.Complete())
                throw new BadRequestException($"Error al actualizar {SubjectArticle} {Subject} con ID {orderId}.");

            return await uow.OrderRepository.GetDtoByIdAsync(orderId);
        }

        private async Task UpdateOrderDeliveryStatus(Order order, int deliveryStatusId, int userId)
        {
            if (order.OrderDeliveryStatus.DeliveryStatus.Id == deliveryStatusId) return;

            var deliveryStatus = await uow.DeliveryStatusRepository.GetByIdAsync(deliveryStatusId);
            if (deliveryStatus == null) throw new NotFoundException("DeliveryStatus not found");

            var user = await context.Users.SingleOrDefaultAsync(x => x.Id == userId);

            order.OrderHistories.Add(new OrderHistory
            {
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                User = user,
                ChangeType = OrderChangeType.DeliveryStatusChanged,
                Property = OrderProperty.DeliveryStatus,
                OldValue = order.OrderDeliveryStatus.DeliveryStatus.Code,
                NewValue = deliveryStatus.Code,
            });

            order.OrderDeliveryStatus = new OrderDeliveryStatus(deliveryStatus);
        }

        private async Task UpdateOrderOrderStatus(Order order, int statusId, int userId)
        {
            if (order.OrderOrderStatus.OrderStatus.Id == statusId) return;

            var status = await uow.OrderStatusRepository.GetByIdAsync(statusId);
            if (status == null) throw new NotFoundException("OrderStatus not found");

            var user = await context.Users.SingleOrDefaultAsync(x => x.Id == userId);
            order.OrderHistories.Add(new OrderHistory
            {
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                User = user,
                ChangeType = OrderChangeType.StatusChanged,
                Property = OrderProperty.OrderStatus,
                OldValue = order.OrderOrderStatus.OrderStatus.Code,
                NewValue = status.Code,
            });
            
            order.OrderOrderStatus = new OrderOrderStatus(status);
        }
    }
}