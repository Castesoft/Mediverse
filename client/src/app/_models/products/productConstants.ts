import { Column, columnCreatedAt, columnDescription, columnEnabled, columnId, columnName, columnVisible } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { Product } from "src/app/_models/products/product";
import { ProductParams } from "src/app/_models/products/productParams";
import { PartialCellsOf, tableCellCode, tableCellCreatedAt, tableCellDescription, tableCellEnabled, tableCellId, TableCellItem, tableCellName, tableCellVisible } from "src/app/_models/tables/tableCellItem";


export const productFormInfo: FormInfo<Product> = {
  ...baseInfo,
  discount: { label: 'Descuento', type: 'number', },
  dosage: { label: 'Dosis', type: 'text', },
  isInternal: { label: 'Interno', type: 'checkbox', },
  lotNumber: { label: 'Número de lote', type: 'text', },
  manufacturer: { label: 'Fabricante', type: 'text', },
  photoUrl: { label: 'URL de la foto', type: 'text', },
  price: { label: 'Precio', type: 'number', },
  quantity: { label: 'Cantidad', type: 'number', },
  unit: { label: 'Unidad', type: 'text', },
} as FormInfo<Product>;

export const productFiltersFormInfo: FormInfo<ProductParams> = {
  ...baseFilterFormInfo,
} as FormInfo<ProductParams>;

export const productDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'producto',
  'productos',
  'Productos',
  'products',
  ['home', 'products']
);

export const productColumns: Column[] = [
  columnId,
  columnName,
  columnDescription,
  new Column('price', 'Precio'),
  new Column('quantity', 'Cantidad'),
  new Column('unit', 'Unidad'),
  new Column('discount', 'Descuento'),
  new Column('dosage', 'Dosis'),
  new Column('lotNumber', 'Número de lote'),
  new Column('manufacturer', 'Fabricante'),
  new Column('photoUrl', 'URL de la foto'),
  new Column('isInternal', 'Interno'),
  columnCreatedAt,
  columnEnabled,
  columnVisible,
];

export const productCells: PartialCellsOf<Product> = {
  createdAt: tableCellCreatedAt,
  description: tableCellDescription,
  enabled: tableCellEnabled,
  name: tableCellName,
  code: tableCellCode,
  visible: tableCellVisible,
  id: tableCellId,
} as PartialCellsOf<Product>;
