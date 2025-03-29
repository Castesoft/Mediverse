import { addressFormInfo } from 'src/app/_models/addresses/addressConstants';
import { Column, columnId, columnName } from "src/app/_models/base/column";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import Clinic from "src/app/_models/clinics/clinic";
import ClinicParams from "src/app/_models/clinics/clinicParams";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { ColumnOptions } from 'src/app/_models/forms/options/columnOptions';
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

export const clinicDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'clínica',
  'clínicas',
  'Clínicas',
  'clinics',
);

export const clinicColumns: Column[] = [
  columnId,
  new Column('image', 'Imagen', { options: new ColumnOptions({ justify: 'start', }) }),
  columnName,
  new Column('address', 'Dirección'),
  new Column('zipcode', 'Código postal'),
];

export const clinicFormInfo: FormInfo<Clinic> = {
  ...addressFormInfo,

  name: { ...addressFormInfo.name, },
  street: { ...addressFormInfo.street, },
  exteriorNumber: { ...addressFormInfo.exteriorNumber, },
  interiorNumber: { ...addressFormInfo.interiorNumber, },
  neighborhood: { ...addressFormInfo.neighborhood, },
  city: { ...addressFormInfo.city, },
  state: { ...addressFormInfo.state, },
  zipcode: { ...addressFormInfo.zipcode, },
  country: { ...addressFormInfo.country, },
  description: { ...addressFormInfo.description, },
  isMain: { ...addressFormInfo.isMain, },

} as FormInfo<Clinic>;

export const clinicFiltersFormInfo: FormInfo<ClinicParams> = {
  ...baseFilterFormInfo,
} as FormInfo<ClinicParams>;

export const clinicCells: PartialCellsOf<Clinic> = {
  createdAt: tableCellCreatedAt,
  description: tableCellDescription,
  isEnabled: tableCellEnabled,
  name: tableCellName,
  code: tableCellCode,
  isVisible: tableCellVisible,
  id: tableCellId,
  city: new TableCellItem<string, 'city'>('city', 'string'),
  country: new TableCellItem<string, 'country'>('country', 'string'),
  latitude: new TableCellItem<number, 'latitude'>('latitude', 'number'),
  longitude: new TableCellItem<number, 'longitude'>('longitude', 'number'),
  nursesCount: new TableCellItem<number, 'nursesCount'>('nursesCount', 'number'),
  state: new TableCellItem<string, 'state'>('state', 'string'),
  isMain: new TableCellItem<boolean, 'isMain'>('isMain', 'boolean'),
  zipcode: new TableCellItem<string, 'zipcode'>('zipcode', 'badge'),
  street: new TableCellItem<string, 'street'>('street', 'string'),
  exteriorNumber: new TableCellItem<string, 'exteriorNumber'>('exteriorNumber', 'string'),
  interiorNumber: new TableCellItem<string, 'interiorNumber'>('interiorNumber', 'string'),
  neighborhood: new TableCellItem<string, 'neighborhood'>('neighborhood', 'string'),
} as PartialCellsOf<Clinic>;


