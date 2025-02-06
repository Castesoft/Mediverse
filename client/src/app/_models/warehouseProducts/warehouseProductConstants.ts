import { Column, columnCreatedAt } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { WarehouseProduct } from "src/app/_models/warehouseProducts/warehouseProduct";
import { WarehouseProductParams } from "src/app/_models/warehouseProducts/warehouseProductParams";
import { baseTableCells, PartialCellsOf, TableCellItem } from "src/app/_models/tables/tableCellItem";

export const warehouseProductDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'producto de almacén',
  'productos de almacén',
  'Productos de Almacén',
  'warehouseProducts'
);

export const warehouseProductColumns: Column[] = [
  new Column('name', 'Nombre'),
  new Column('description', 'Descripción'),
  new Column('address', 'Dirección'),
  columnCreatedAt,
];

export const warehouseProductFormInfo: FormInfo<WarehouseProduct> = {
  ...baseInfo,
  name: { label: 'Nombre', type: 'text' },
  description: { label: 'Descripción', type: 'text' },
  address: { label: 'Dirección', type: 'select' },
} as unknown as FormInfo<WarehouseProduct>;

export const warehouseProductFiltersFormInfo: FormInfo<WarehouseProductParams> = {
  ...baseFilterFormInfo,
  name: { label: 'Nombre', type: 'text' },
  address: { label: 'Dirección', type: 'select' },
} as FormInfo<WarehouseProductParams>;

export const warehouseProductCells: PartialCellsOf<WarehouseProduct> = {
  ...baseTableCells,
  name: new TableCellItem<string, 'name'>('name', 'string', { justification: 'start' }),
  description: new TableCellItem<string, 'description'>('description', 'string', { justification: 'start' }),
  address: new TableCellItem<string, 'address'>('address', 'string', { justification: 'start' }),
  createdAt: new TableCellItem<Date, 'createdAt'>('createdAt', 'date', { justification: 'end', fullDate: true }),
} as PartialCellsOf<WarehouseProduct>;
