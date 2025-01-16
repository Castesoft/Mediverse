import { Address } from "src/app/_models/addresses/address";
import { baseInfo } from "src/app/_models/base/entity";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { AddressParams } from './addressParams';
import { SelectOption } from "src/app/_models/base/selectOption";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { Column, columnCreatedAt, columnId } from "src/app/_models/base/column";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
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


export const addressFormInfo: FormInfo<Address> = {
  ...baseInfo,
  city: { label: 'Ciudad', type: 'text' },
  country: { label: 'País', type: 'text' },
  exteriorNumber: { label: 'Número exterior', type: 'text' },
  interiorNumber: { label: 'Número interior', type: 'text' },
  isMain: { label: 'Es principal', type: 'checkbox' },
  latitude: { label: 'Latitud', type: 'number' },
  longitude: { label: 'Longitud', type: 'number' },
  neighborhood: { label: 'Colonia', type: 'text' },
  nursesCount: { label: 'Número de enfermeras', type: 'number' },
  photoUrl: { label: 'URL de foto', type: 'text' },
  state: { label: 'Estado', type: 'text' },
  street: { label: 'Calle', type: 'text' },
  type: { label: 'Tipo', type: 'select' },
  zipcode: { label: 'Código postal', type: 'text' },
  select: { label: 'Dirección', type: 'typeahead', orientation: 'inline', },
} as FormInfo<Address>;

export const addressFiltersFormInfo: FormInfo<AddressParams> = {
  ...baseFilterFormInfo,
} as FormInfo<AddressParams>;

export const sortOptions: SelectOption[] = Object.values({
  city: new SelectOption({ id: 1, name: 'Ciudad', code: 'city' }),
  country: new SelectOption({ id: 2, name: 'País', code: 'country' }),
  createdAt: new SelectOption({ id: 3, name: 'Creado', code: 'createdAt' }),
  description: new SelectOption({ id: 4, name: 'Descripción', code: 'description' }),
  enabled: new SelectOption({ id: 5, name: 'Habilitado', code: 'enabled' }),
  exteriorNumber: new SelectOption({ id: 6, name: 'Número exterior', code: 'exteriorNumber' }),
  id: new SelectOption({ id: 7, name: 'ID', code: 'id' }),
  interiorNumber: new SelectOption({ id: 8, name: 'Número interior', code: 'interiorNumber' }),
  isMain: new SelectOption({ id: 9, name: 'Principal', code: 'isMain' }),
  isSelected: new SelectOption({ id: 10, name: 'Seleccionado', code: 'isSelected' }),
  latitude: new SelectOption({ id: 11, name: 'Latitud', code: 'latitude' }),
  longitude: new SelectOption({ id: 12, name: 'Longitud', code: 'longitude' }),
  name: new SelectOption({ id: 13, name: 'Nombre', code: 'name' }),
  neighborhood: new SelectOption({ id: 14, name: 'Colonia', code: 'neighborhood' }),
  nursesCount: new SelectOption({ id: 15, name: 'Número de enfermeras', code: 'nursesCount' }),
  photoUrl: new SelectOption({ id: 16, name: 'URL de la foto', code: 'photoUrl' }),
  state: new SelectOption({ id: 17, name: 'Estado', code: 'state' }),
  street: new SelectOption({ id: 18, name: 'Calle', code: 'street' }),
  type: new SelectOption({ id: 19, name: 'Tipo', code: 'type' }),
  visible: new SelectOption({ id: 20, name: 'Visible', code: 'visible' }),
  zipcode: new SelectOption({ id: 21, name: 'Código postal', code: 'zipcode' }),
});

export const addressDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'dirección',
  'direcciones',
  'Dirección',
  'addresses',
);

export const addressColumns: Column[] = [
  columnId,
  new Column('name', 'Clínica'),
  new Column('street', 'Calle'),
  new Column('exteriorNumber', 'Número exterior'),
  new Column('interiorNumber', 'Número interior'),
  new Column('neighborhood', 'Colonia'),
  new Column('zipcode', 'Código postal'),
  new Column('city', 'Ciudad'),
  new Column('state', 'Estado'),
  new Column('country', 'País'),
  new Column('nursesCount', 'Número de enfermeras'),
  new Column('isMain', 'Principal'),
  columnCreatedAt,
];

export const addressCells: PartialCellsOf<Address> = {
  createdAt: tableCellCreatedAt,
  description: tableCellDescription,
  enabled: tableCellEnabled,
  name: tableCellName,
  code: tableCellCode,
  visible: tableCellVisible,
  id: tableCellId,
  city: new TableCellItem<string, 'city'>('city', 'string'),
  country: new TableCellItem<string, 'country'>('country', 'string'),
  latitude: new TableCellItem<number, 'latitude'>('latitude', 'number'),
  longitude: new TableCellItem<number, 'longitude'>('longitude', 'number'),
  nursesCount: new TableCellItem<number, 'nursesCount'>('nursesCount', 'number'),
  state: new TableCellItem<string, 'state'>('state', 'string'),
  isMain: new TableCellItem<boolean, 'isMain'>('isMain', 'boolean'),
  zipcode: new TableCellItem<string, 'zipcode'>('zipcode', 'string'),
  street: new TableCellItem<string, 'street'>('street', 'string'),
  exteriorNumber: new TableCellItem<string, 'exteriorNumber'>('exteriorNumber', 'string'),
  interiorNumber: new TableCellItem<string, 'interiorNumber'>('interiorNumber', 'string'),
  neighborhood: new TableCellItem<string, 'neighborhood'>('neighborhood', 'string'),
} as PartialCellsOf<Address>;

