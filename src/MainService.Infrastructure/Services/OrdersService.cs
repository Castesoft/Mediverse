using MainService.Core.DTOs.Orders;
using MainService.Core.Helpers;
using MainService.Core.Interfaces.Services;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MainService.Infrastructure.Services
{
    public class OrdersService(DataContext context, IUnitOfWork uow) : IOrdersService
    {
        private const string Subject = "orden";
        private const string SubjectArticle = "La";

        public async Task<Order> CreateAsync(List<OrderProduct> items, int customerId, int doctorId)
        {
            var orderStatus = await context.OrderStatuses
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Name == "Pendiente");
            var deliveryStatus = await context.DeliveryStatuses
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Name == "Pendiente");

            if (orderStatus == null || deliveryStatus == null)
            {
                Log.Error(
                    "Required status not found in database during order creation: OrderStatus 'Pendiente' found: {OrderStatusFound}, DeliveryStatus 'Pendiente' found: {DeliveryStatusFound}",
                    orderStatus != null, deliveryStatus != null);

                throw new InvalidOperationException(
                    "OrderStatus 'Pendiente' or DeliveryStatus 'Pendiente' not found in the database. Please ensure seed data exists and is correctly named.");
            }


            var order = new Order
            {
                Total = 0,
                Subtotal = 0,
                Discount = 0,
                Tax = 0,
                AmountPaid = 0,
                AmountDue = 0,

                OrderItems = new List<OrderProduct>(),
                PatientOrder = new PatientOrder(customerId),
                DoctorOrder = new DoctorOrder(doctorId),
                OrderOrderStatus = new OrderOrderStatus(orderStatus.Id),
                OrderDeliveryStatus = new OrderDeliveryStatus(deliveryStatus.Id),
                OrderHistories = new List<OrderHistory>(),
            };


            int? addressId = await context.UserAddresses
                .Where(x => x.UserId == customerId && x.IsMain)
                .Select(x => x.AddressId)
                .SingleOrDefaultAsync();

            if (addressId.HasValue)
            {
                order.OrderDeliveryAddress = new OrderDeliveryAddress(addressId.Value);
            }


            decimal currentSubtotal = 0m;
            foreach (var orderItem in items)
            {
                if (orderItem == null)
                {
                    Log.Warning(
                        "Null OrderProduct item received in CreateAsync for customer {CustomerId}. Skipping item.",
                        customerId);
                    continue;
                }


                if (!orderItem.Price.HasValue || !orderItem.Quantity.HasValue)
                {
                    Log.Warning(
                        "OrderProduct item for ProductId {ProductId} is missing Price or Quantity in CreateAsync for customer {CustomerId}. Skipping item.",
                        orderItem.ProductId, customerId);
                    continue;
                }


                order.OrderItems.Add(orderItem);


                currentSubtotal += (orderItem.Price.Value) * (orderItem.Quantity.Value);


                orderItem.Product = null!;
            }

            order.Subtotal = currentSubtotal;


            order.Tax = 0;
            order.Total = order.Subtotal + order.Tax;
            order.AmountDue = order.Total - (order.AmountPaid ?? 0);


            if (order.OrderHistories == null) order.OrderHistories = new List<OrderHistory>();

            order.OrderHistories.Add(new OrderHistory
            {
                UserId = doctorId,
                ChangeType = OrderChangeType.Created,
                Property = OrderProperty.OrderStatus,
                OldValue = null,
                NewValue = orderStatus.Code,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });


            order.OrderHistories.Add(new OrderHistory
            {
                UserId = doctorId,
                ChangeType = OrderChangeType.PrescriptionLinked,
                Property = OrderProperty.Items,
                OldValue = null,
                NewValue = $"Items added from Prescription",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            return order;
        }


        public async Task<OrderDto?> UpdateAsync(OrderUpdateDto request, int orderId, int userId)
        {
            if (request.DeliveryStatus?.Id == null) throw new BadRequestException("El estado de entrega es requerido");
            if (request.Status?.Id == null) throw new BadRequestException("El estado es requerido");

            var order = await uow.OrderRepository.GetByIdAsync(orderId);
            if (order == null) throw new NotFoundException($"{SubjectArticle} {Subject} no existe");


            await context.Entry(order).Reference(o => o.OrderDeliveryStatus).Query().Include(ods => ods.DeliveryStatus)
                .LoadAsync();
            await context.Entry(order).Reference(o => o.OrderOrderStatus).Query().Include(oos => oos.OrderStatus)
                .LoadAsync();


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
            if (order.OrderDeliveryStatus?.DeliveryStatus?.Id == deliveryStatusId) return;

            var deliveryStatus = await uow.DeliveryStatusRepository.GetByIdAsync(deliveryStatusId);
            if (deliveryStatus == null) throw new NotFoundException("DeliveryStatus not found");

            var user = await context.Users.FindAsync(userId);
            if (user == null)
            {
                Log.Warning("User with ID {UserId} not found when updating order history for Order ID {OrderId}",
                    userId, order.Id);
            }


            if (order.OrderHistories == null) order.OrderHistories = new List<OrderHistory>();


            string? oldStatusCode = order.OrderDeliveryStatus?.DeliveryStatus?.Code;

            order.OrderHistories.Add(new OrderHistory
            {
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UserId = userId,
                User = user,
                ChangeType = OrderChangeType.DeliveryStatusChanged,
                Property = OrderProperty.DeliveryStatus,
                OldValue = oldStatusCode,
                NewValue = deliveryStatus.Code,
            });
            order.OrderDeliveryStatus = new OrderDeliveryStatus(deliveryStatus);
        }


        private async Task UpdateOrderOrderStatus(Order order, int statusId, int userId)
        {
            if (order.OrderOrderStatus?.OrderStatus?.Id == statusId) return;

            var status = await uow.OrderStatusRepository.GetByIdAsync(statusId);
            if (status == null) throw new NotFoundException("OrderStatus not found");

            var user = await context.Users.FindAsync(userId);
            if (user == null)
            {
                Log.Warning("User with ID {UserId} not found when updating order history for Order ID {OrderId}",
                    userId, order.Id);
            }


            if (order.OrderHistories == null) order.OrderHistories = [];


            string? oldStatusCode = order.OrderOrderStatus?.OrderStatus?.Code;

            order.OrderHistories.Add(new OrderHistory
            {
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UserId = userId,
                User = user,
                ChangeType = OrderChangeType.StatusChanged,
                Property = OrderProperty.OrderStatus,
                OldValue = oldStatusCode,
                NewValue = status.Code,
            });
            order.OrderOrderStatus = new OrderOrderStatus(status);
        }
    }
}