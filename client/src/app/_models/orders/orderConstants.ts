import { Column, columnCreatedAt } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { Order } from "src/app/_models/orders/order";
import { OrderParams } from "src/app/_models/orders/orderParams";
import { baseTableCells, PartialCellsOf } from "src/app/_models/tables/tableCellItem";

export const orderDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'pedido',
  'pedidos',
  'Pedidos',
  'orders',
  ['home', 'orders'],
);

export const orderColumns: Column[] = [
  columnCreatedAt,
  { label: "Paciente", name: "patient" },
  { label: "Estado", name: "status" },
  { label: "Entrega", name: "deliveryStatus" },
  { label: "Dirección", name: "address" },
  { label: "Total", name: "total", options: { justify: "end" } },
];

export const orderFormInfo: FormInfo<Order> = {
  ...baseInfo,
} as FormInfo<Order>;

export const orderFiltersFormInfo: FormInfo<OrderParams> = {
  ...baseFilterFormInfo,
} as FormInfo<OrderParams>;

export const orderCells: PartialCellsOf<Order> = {
  ...baseTableCells,
} as PartialCellsOf<Order>;
