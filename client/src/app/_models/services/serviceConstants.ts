import {
  Column,
  columnCreatedAt,
  columnDescription,
  columnName
} from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { ColumnOptions } from "src/app/_models/forms/options/columnOptions";
import { Service } from "src/app/_models/services/service";
import { ServiceParams } from "src/app/_models/services/serviceParams";
import {
  PartialCellsOf,
  tableCellCode,
  tableCellCreatedAt,
  tableCellDescription,
  tableCellEnabled,
  tableCellId,
  TableCellItem,
  tableCellName,
  tableCellVisible
} from "src/app/_models/tables/tableCellItem";


export const serviceFormInfo: FormInfo<Service> = {
  ...baseInfo,
  discount: { label: 'Descuento', type: 'number' },
  photoUrl: { label: 'URL de foto', type: 'text' },
  price: { label: 'Precio', type: 'number' },

  select: { label: 'Servicio', type: 'select' },
} as FormInfo<Service>;

export const serviceFiltersFormInfo: FormInfo<ServiceParams> = {
  ...baseFilterFormInfo,
} as FormInfo<ServiceParams>;

export const serviceCells: PartialCellsOf<Service> = {
  createdAt: tableCellCreatedAt,
  description: tableCellDescription,
  isEnabled: tableCellEnabled,
  name: tableCellName,
  code: tableCellCode,
  isVisible: tableCellVisible,
  id: tableCellId,
  price: new TableCellItem<number, 'price'>('price', 'currency'),
  discount: new TableCellItem<number, 'discount'>('discount', 'number'),
};

export const serviceDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'servicio',
  'servicios',
  'Servicios',
  'services',
);

export const serviceColumns: Column[] = [
  columnName,
  columnDescription,
  new Column('price', 'Precio', { options: new ColumnOptions({ justify: 'end', }) }),
  new Column('discount', 'Descuento', { options: new ColumnOptions({ justify: 'end', }) }),
  columnCreatedAt,
];
