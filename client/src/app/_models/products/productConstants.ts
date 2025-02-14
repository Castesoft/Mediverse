import {
  Column,
  columnCreatedAt,
  columnEnabled,
  columnName,
  columnVisible
} from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { ColumnOptions } from "src/app/_models/forms/options/columnOptions";
import { Product } from "src/app/_models/products/product";
import { ProductParams } from "src/app/_models/products/productParams";
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
import { Validators } from "@angular/forms";


export const productFormInfo: FormInfo<Product> = {
  ...baseInfo,
  discount: { label: 'Descuento', type: 'number', },
  discountType: { label: 'Tipo de descuento', type: 'text', },
  description: { label: 'Descripción', type: 'textarea', rows: 6, validators: [ Validators.required ] },
  name: { label: 'Nombre', type: 'text', validators: [ Validators.required ] },
  dosage: { label: 'Dosis', type: 'number', validators: [ Validators.required ] },
  isInternal: { label: 'Interno', type: 'slideToggle', },
  lotNumber: { label: 'Número de lote', type: 'text', validators: [ Validators.required ] },
  manufacturer: { label: 'Fabricante', type: 'text', validators: [ Validators.required ] },
  photoUrl: { label: 'URL de la foto', type: 'text', },
  price: { label: 'Precio Base', type: 'number', validators: [ Validators.required ] },
  quantity: { label: 'Cantidad', type: 'number', },
  unit: { label: 'Unidad', type: 'text', validators: [ Validators.required ] },
} as unknown as FormInfo<Product>;

export const productFiltersFormInfo: FormInfo<ProductParams> = {
  ...baseFilterFormInfo,
  sku: { label: 'SKU', type: 'text' },
  barcode: { label: 'Código de barras', type: 'text' },
  manufacturer: { label: 'Fabricante', type: 'multiselect' },
  price: { label: 'Precio', type: 'number' },
  category: { label: 'Categoría', type: 'multiselect' },
  lotNumber: {label: 'Número de lote', type: 'text'},
} as FormInfo<ProductParams>;

export const productDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'producto',
  'productos',
  'Productos',
  'products',
);

export const productColumns: Column[] = [
  new Column('image', 'Imagen', { options: new ColumnOptions({ justify: 'start', }) }),
  columnName,
  new Column('price', 'Precio', { options: new ColumnOptions({ justify: 'end', }) }),
  new Column('discount', 'Descuento', { options: new ColumnOptions({ justify: 'end', }) }),
  new Column('dosage', 'Dosis', { options: new ColumnOptions({ justify: 'end', }) }),
  new Column('lotNumber', 'Lote', { options: new ColumnOptions({ justify: 'start', }) }),
  new Column('manufacturer', 'Fabricante', { options: new ColumnOptions({ justify: 'start', }) }),
  columnEnabled,
  columnVisible,
  columnCreatedAt,
];

export const productCells: PartialCellsOf<Product> = {
  createdAt: tableCellCreatedAt,
  description: tableCellDescription,
  isEnabled: tableCellEnabled,
  name: tableCellName,
  code: tableCellCode,
  isVisible: tableCellVisible,
  id: tableCellId,
  price: new TableCellItem<number, 'price'>('price', 'currency', { justification: 'end', }),
  quantity: new TableCellItem<number, 'quantity'>('quantity', 'number', { justification: 'end', }),
  discount: new TableCellItem<number, 'discount'>('discount', 'number', { justification: 'end', }),
  dosage: new TableCellItem<string, 'dosage'>('dosage', 'string', { justification: 'end', }),
  unit: new TableCellItem<string, 'unit'>('unit', 'string'),
  lotNumber: new TableCellItem<string, 'lotNumber'>('lotNumber', 'badge'),
  manufacturer: new TableCellItem<string, 'manufacturer'>('manufacturer', 'string'),
} as PartialCellsOf<Product>;
