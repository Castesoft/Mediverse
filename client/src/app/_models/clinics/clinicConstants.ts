import { Column, columnId, columnName } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import Clinic from "src/app/_models/clinics/clinic";
import ClinicParams from "src/app/_models/clinics/clinicParams";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { PartialCellsOf, tableCellCreatedAt, tableCellDescription, tableCellEnabled, tableCellName, tableCellCode, tableCellVisible, tableCellId, TableCellItem } from "src/app/_models/tables/tableCellItem";

export const clinicDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'clínica',
  'clínicas',
  'Clínicas',
  'clinics',
  ['inicio']
);

export const clinicColumns: Column[] = [
  columnId,
  columnName,
  new Column('street', 'Calle'),
  new Column('exteriorNumber', 'Número exterior'),
  new Column('interiorNumber', 'Número interior'),
  new Column('neighborhood', 'Colonia'),
  new Column('city', 'Ciudad'),
  new Column('state', 'Estado'),
  new Column('country', 'País'),
  new Column('zipcode', 'Código postal'),
];

export const clinicFormInfo: FormInfo<Clinic> = {
  ...baseInfo,

  select: { label: 'Clínica', type: 'select' },
} as FormInfo<Clinic>;

export const clinicFiltersFormInfo: FormInfo<ClinicParams> = {
  ...baseFilterFormInfo,
} as FormInfo<ClinicParams>;

export const clinicCells: PartialCellsOf<Clinic> = {
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
} as PartialCellsOf<Clinic>;


