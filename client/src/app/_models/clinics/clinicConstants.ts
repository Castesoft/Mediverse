import { addressFormInfo } from 'src/app/_models/addresses/addressConstants';
import { Column, columnCreatedAt, columnName } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import Clinic from "src/app/_models/clinics/clinic";
import ClinicParams from "src/app/_models/clinics/clinicParams";
import { FormInfo } from "src/app/_models/forms/formTypes";
import {
  PartialCellsOf,
  tableCellCreatedAt,
  tableCellDescription,
  tableCellEnabled,
  tableCellName,
  tableCellCode,
  tableCellVisible,
  tableCellId,
  TableCellItem
} from "src/app/_models/tables/tableCellItem";

export const clinicDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'clínica',
  'clínicas',
  'Clínicas',
  'clinics',
);

export const clinicColumns: Column[] = [
  columnName,
  new Column('address', 'Dirección'),
  new Column('zipcode', 'Código postal'),
];

export const clinicFormInfo: FormInfo<Clinic> = {
  ...addressFormInfo,

  name: { ...addressFormInfo.name, solid: true, },
  street: { ...addressFormInfo.street, solid: true, },
  exteriorNumber: { ...addressFormInfo.exteriorNumber, solid: true, },
  interiorNumber: { ...addressFormInfo.interiorNumber, solid: true, },
  neighborhood: { ...addressFormInfo.neighborhood, solid: true, },
  city: { ...addressFormInfo.city, solid: true, },
  state: { ...addressFormInfo.state, solid: true, },
  zipcode: { ...addressFormInfo.zipcode, solid: true, },
  country: { ...addressFormInfo.country, solid: true, },


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


