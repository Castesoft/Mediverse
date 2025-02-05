import { Column, columnCreatedAt } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { Warehouse } from "src/app/_models/warehouses/warehouse";
import { WarehouseParams } from "src/app/_models/warehouses/warehouseParams";
import { baseTableCells, PartialCellsOf, TableCellItem } from "src/app/_models/tables/tableCellItem";

export const warehouseDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'almacén',
  'almacenes',
  'Almacenes',
  'warehouses'
);

export const warehouseColumns: Column[] = [
  new Column('name', 'Nombre'),
  new Column('description', 'Descripción'),
  new Column('address', 'Dirección'),
  columnCreatedAt,
];

export const warehouseFormInfo: FormInfo<Warehouse> = {
  ...baseInfo,
  name: { label: 'Nombre', type: 'text' },
  description: { label: 'Descripción', type: 'text' },
  address: { label: 'Dirección', type: 'select' },
} as unknown as FormInfo<Warehouse>;

export const warehouseFiltersFormInfo: FormInfo<WarehouseParams> = {
  ...baseFilterFormInfo,
  name: { label: 'Nombre', type: 'text' },
  address: { label: 'Dirección', type: 'select' },
} as FormInfo<WarehouseParams>;

export const warehouseCells: PartialCellsOf<Warehouse> = {
  ...baseTableCells,
  name: new TableCellItem<string, 'name'>('name', 'string', { justification: 'start' }),
  description: new TableCellItem<string, 'description'>('description', 'string', { justification: 'start' }),
  address: new TableCellItem<string, 'address'>('address', 'string', { justification: 'start' }),
  createdAt: new TableCellItem<Date, 'createdAt'>('createdAt', 'date', { justification: 'end', fullDate: true }),
} as PartialCellsOf<Warehouse>;
