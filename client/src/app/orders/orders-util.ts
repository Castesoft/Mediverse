import { OrderDeliveryStatus, OrderStatus } from "src/app/_models/orders/orderTypes";
import { SelectOption } from "src/app/_models/base/selectOption";

export const orderStatuses: SelectOption[] = [
  new SelectOption({ id: 1, code: 'pending', name: 'Pendiente' }),
  new SelectOption({ id: 2, code: 'completed', name: 'Procesando' }),
  new SelectOption({ id: 3, code: 'cancelled', name: 'Cancelado' })
];

export const deliveryOrderStatuses: SelectOption[] = [
  new SelectOption({ id: 1, code: 'pending', name: 'Pendiente' }),
  new SelectOption({ id: 2, code: 'processing', name: 'Procesando' }),
  new SelectOption({ id: 3, code: 'inprogress', name: 'En progreso' }),
  new SelectOption({ id: 4, code: 'delivered', name: 'Entregado' }),
  new SelectOption({ id: 5, code: 'cancelled', name: 'Cancelado' })
];

// Order Status
export function getOrderStatus(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Pending:
      return 'Pendiente';
    case OrderStatus.Completed:
      return 'Procesando';
    case OrderStatus.Cancelled:
      return 'Cancelado';
    default:
      return '';
  }
}

export function getOrderStatusBadgeColor(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Pending:
      return 'warning';
    case OrderStatus.Completed:
      return 'success';
    case OrderStatus.Cancelled:
      return 'danger';
    default:
      return 'primary';
  }
}

export function parseOrderStatusFromSelectOption(statusOption: SelectOption | null): OrderStatus | null {
  const code: string | undefined = statusOption?.code;

  switch (code?.toLowerCase()) {
    case 'pending':
      return OrderStatus.Pending;
    case 'completed':
      return OrderStatus.Completed;
    case 'cancelled':
      return OrderStatus.Cancelled;
    default:
      return null;
  }
}

// Order Delivery Status
export function getOrderDeliveryStatus(status: OrderDeliveryStatus): string {
  switch (status) {
    case OrderDeliveryStatus.Pending:
      return 'Pendiente';
    case OrderDeliveryStatus.Processing:
      return 'Procesando';
    case OrderDeliveryStatus.InProgress:
      return 'En Proceso';
    case OrderDeliveryStatus.Delivered:
      return 'Entregado';
    case OrderDeliveryStatus.Cancelled:
      return 'Cancelado';
    default:
      return '';
  }
}

export function getOrderDeliveryStatusBadgeColor(status: OrderDeliveryStatus): string {
  switch (status) {
    case OrderDeliveryStatus.Pending:
      return 'warning';
    case OrderDeliveryStatus.Processing:
      return 'info';
    case OrderDeliveryStatus.InProgress:
      return 'primary';
    case OrderDeliveryStatus.Delivered:
      return 'success';
    case OrderDeliveryStatus.Cancelled:
      return 'danger';
    default:
      return 'primary';
  }
}

export function parseOrderDeliveryStatusFromSelectOption(statusOption: SelectOption | null): OrderDeliveryStatus | null {
  const code: string | undefined = statusOption?.code;

  switch (code?.toLowerCase()) {
    case 'pending':
      return OrderDeliveryStatus.Pending;
    case 'processing':
      return OrderDeliveryStatus.Processing;
    case 'inprogress':
      return OrderDeliveryStatus.InProgress;
    case 'delivered':
      return OrderDeliveryStatus.Delivered;
    case 'cancelled':
      return OrderDeliveryStatus.Cancelled;
    default:
      return null;
  }
}
