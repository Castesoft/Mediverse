import { Column, columnCreatedAt, columnId } from "src/app/_models/base/column"
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { ColumnOptions } from "src/app/_models/forms/options/columnOptions";
import Patient from "src/app/_models/patients/patient";
import { PatientParams } from "src/app/_models/patients/patientParams";
import { baseTableCells, PartialCellsOf, TableCellItem } from "src/app/_models/tables/tableCellItem";

export const patientFormInfo: FormInfo<Patient> = {
  ...baseInfo,
} as FormInfo<Patient>;

export const patientFiltersFormInfo: FormInfo<PatientParams> = {
  ...baseFilterFormInfo,
} as FormInfo<PatientParams>;

export const patientColumns: Column[] = [
  columnId,
  new Column('fullName', 'Nombre'),
  new Column('email', 'Correo electrónico'),
  new Column('phoneNumber', 'Teléfono'),
  new Column('age', 'Edad'),
  new Column('sex', 'Sexo'),
  new Column('dateOfBirth', 'Fecha de nacimiento', { options: new ColumnOptions({ justify: 'end', })}),
  new Column('taxId', 'RFC'),
  new Column('eventsCount', 'Citas'),
  new Column('prescriptionsCount', 'Recetas'),
  new Column('ordersCount', 'Pedidos'),
  columnCreatedAt,
];

export const patientDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'paciente',
  'pacientes',
  'Pacientes',
  'patients',
  ['inicio']
);

export const patientCells: PartialCellsOf<Patient> = {
  ...baseTableCells,
  age: new TableCellItem<number, 'age'>('age', 'number', { unit: 'años', }),
  city: new TableCellItem<string, 'city'>('city', 'string'),
  country: new TableCellItem<string, 'country'>('country', 'string'),
  dateOfBirth: new TableCellItem<Date, 'dateOfBirth'>('dateOfBirth', 'date'),
  email: new TableCellItem<string, 'email'>('email', 'string'),
  firstName: new TableCellItem<string, 'firstName'>('firstName', 'string'),
  education: new TableCellItem<string, 'education'>('education', 'string'),
  fullName: new TableCellItem<string, 'fullName'>('fullName', 'string'),
  eventsCount: new TableCellItem<number, 'eventsCount'>('eventsCount', 'number'),
  prescriptionsCount: new TableCellItem<number, 'prescriptionsCount'>('prescriptionsCount', 'number'),
  ordersCount: new TableCellItem<number, 'ordersCount'>('ordersCount', 'number'),
  sex: new TableCellItem<string, 'sex'>('sex', 'string'),
  phoneNumber: new TableCellItem<string, 'phoneNumber'>('phoneNumber', 'string'),
  taxId: new TableCellItem<string, 'taxId'>('taxId', 'string'),
} as PartialCellsOf<Patient>;

