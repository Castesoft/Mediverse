import { Column, columnCreatedAt } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { SelectOption } from 'src/app/_models/base/selectOption';
import { FormInfo } from "src/app/_models/forms/formTypes";
import { ColumnOptions } from 'src/app/_models/forms/options/columnOptions';
import { Order } from "src/app/_models/orders/order";
import { OrderParams } from "src/app/_models/orders/orderParams";
import { baseTableCells, PartialCellsOf, TableCellItem } from "src/app/_models/tables/tableCellItem";
import { orderDeliveryStatuses, orderStatuses } from "src/app/orders/orders-util";

export const orderDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'pedido',
  'pedidos',
  'Pedidos',
  'orders'
);

export const orderColumns: Column[] = [
  new Column('doctor', 'Doctor'),
  new Column('patient', 'Paciente'),
  new Column('status', 'Estado'),
  new Column('deliveryStatus', 'Entrega'),
  new Column('deliveryAddress', 'Dirección'),
  new Column('subtotal', 'Subtotal', { options: new ColumnOptions({ justify: 'end', }) }),
  new Column('discount', 'Descuento', { options: new ColumnOptions({ justify: 'end', }) }),
  new Column('tax', 'Impuesto', { options: new ColumnOptions({ justify: 'end', }) }),
  new Column('total', 'Total', { options: new ColumnOptions({ justify: 'end', }) }),
  columnCreatedAt,
];

export const orderFormInfo: FormInfo<Order> = {
  ...baseInfo,
  status: { label: 'Estatus', type: 'select', showCodeSpan: false, selectOptions: orderStatuses },
  deliveryStatus: { label: 'Entrega', type: 'select', showCodeSpan: false, selectOptions: orderDeliveryStatuses },
  total: { label: 'Total', type: 'number', },
  subtotal: { label: 'Subtotal', type: 'number', },
  discount: { label: 'Descuento', type: 'number', },
  tax: { label: 'Impuesto', type: 'number', },
  amountPaid: { label: 'Pagado', type: 'number', },
  amountDue: { label: 'Deuda', type: 'number', },
  deliveryAddress: { label: 'Dirección', type: 'select' },

} as unknown as FormInfo<Order>;

export const orderFiltersFormInfo: FormInfo<OrderParams> = {
  ...baseFilterFormInfo,
} as FormInfo<OrderParams>;

export const orderCells: PartialCellsOf<Order> = {
  ...baseTableCells,
  total: new TableCellItem<number, 'total'>('total', 'currency', { justification: 'end' }),
  subtotal: new TableCellItem<number, 'subtotal'>('subtotal', 'currency', { justification: 'end' }),
  discount: new TableCellItem<number, 'discount'>('discount', 'currency', { justification: 'end' }),
  amountDue: new TableCellItem<number, 'amountDue'>('amountDue', 'currency', { justification: 'end' }),
  amountPaid: new TableCellItem<number, 'amountPaid'>('amountPaid', 'currency', { justification: 'end' }),
  tax: new TableCellItem<number, 'tax'>('tax', 'currency', { justification: 'end' }),
  patient: new TableCellItem<SelectOption, 'patient'>('patient', 'code', { isLink: false, showCodeSpan: false, }),
  deliveryStatus: new TableCellItem<SelectOption, 'deliveryStatus'>('deliveryStatus', 'code', {
    isLink: false,
    showCodeSpan: false,
  }),
  status: new TableCellItem<SelectOption, 'status'>('status', 'code', { isLink: false, showCodeSpan: false, }),
  deliveryAddress: new TableCellItem<SelectOption, 'deliveryAddress'>('deliveryAddress', 'code', { isLink: false, showCodeSpan: false, }),
} as PartialCellsOf<Order>;
