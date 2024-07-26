import { OrderDeliveryStatus, OrderStatus } from "src/app/_models/order";

const orderStatusMap: { [key in OrderStatus]: string } = {
  pending: 'Pendiente',
  completed: 'Completado',
  cancelled: 'Cancelado'
};

const orderStatusBadgeColorMap: { [key in OrderStatus]: string } = {
  pending: 'warning',
  completed: 'success',
  cancelled: 'danger'
};

const orderDeliveryStatusMap: { [key in OrderDeliveryStatus]: string } = {
  processing: 'Procesando',
  inprogress: 'En progreso',
  delivered: 'Entregado',
  cancelled: 'Cancelado'
};

const orderDeliveryStatusBadgeColorMap: { [key in OrderDeliveryStatus]: string } = {
  processing: 'info',
  inprogress: 'primary',
  delivered: 'success',
  cancelled: 'danger'
};

export const parseOrderDeliveryStatusBadgeColor = (str: OrderDeliveryStatus) => orderDeliveryStatusBadgeColorMap[str] || 'primary';
export const parseOrderStatusBadgeColor = (str: OrderStatus) => orderStatusBadgeColorMap[str] || 'primary';
export const parseOrderDeliveryStatus = (str: OrderDeliveryStatus) => orderDeliveryStatusMap[str] || str;
export const parseOrderStatus = (str: OrderStatus) => orderStatusMap[str] || str;
