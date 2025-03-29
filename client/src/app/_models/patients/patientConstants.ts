import { Validators } from '@angular/forms';
import { Column, columnCreatedAt, columnId } from "src/app/_models/base/column"
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { SelectOption } from 'src/app/_models/base/selectOption';
import { FormInfo } from "src/app/_models/forms/formTypes";
import { ColumnOptions } from "src/app/_models/forms/options/columnOptions";
import { Patient } from 'src/app/_models/patients/patient';
import { PatientParams } from "src/app/_models/patients/patientParams";
import { baseTableCells, PartialCellsOf, TableCellItem } from "src/app/_models/tables/tableCellItem";

export const sexOptions: SelectOption[] = [
  new SelectOption({ id: 1, code: 'Masculino', name: 'Masculino' }),
  new SelectOption({ id: 2, code: 'Femenino', name: 'Femenino' }),
];

export const patientFormInfo: FormInfo<Patient> = {
  ...baseInfo,
  firstName: {
    label: 'Nombre(s)',
    type: 'text',
    validators: [ Validators.required, Validators.maxLength(500), ],
    orientation: 'inline',
  },
  lastName: {
    label: 'Apellido(s)',
    type: 'text',
    validators: [ Validators.required, Validators.maxLength(500), ],
    orientation: 'inline',
  },
  dateOfBirth: {
    label: 'Fecha de nacimiento',
    type: 'date',
    validators: [ Validators.required, Validators.maxLength(100), ],
  },
  sex: {
    label: 'Sexo',
    type: 'radio',
    validators: [ Validators.required, ],
    selectOptions: sexOptions,
    orientation: 'inline',
    showCodeSpan: false,
  },
  email: {
    label: 'Correo electrónico',
    type: 'email',
    validators: [ Validators.required, Validators.email, Validators.maxLength(500), ]
  },
  phoneNumber: { label: 'Teléfono', type: 'tel', validators: [ Validators.required, Validators.maxLength(100), ] },
  recommendedBy: { label: 'Recomendado por', type: 'text', validators: [ Validators.maxLength(500), ] },
  select: { label: 'Paciente', type: 'select', },
} as FormInfo<Patient>;

export const patientFiltersFormInfo: FormInfo<PatientParams> = {
  ...baseFilterFormInfo,
  firstName: { label: 'Nombre(s)', type: 'text' },
  lastName: { label: 'Apellido(s)', type: 'text' },
  // sex: { label: 'Sexo', type: 'select', selectOptions: sexOptions },
  sex: { label: 'Sexo', type: 'text' },
  phoneNumber: { label: 'Teléfono', type: 'tel' },
  rfc: { label: 'RFC', type: 'text' },
  prescriptions: { label: 'Recetas', type: 'number' },
  ageFrom: { label: 'Edad desde', type: 'number' },
  events: { label: 'Citas', type: 'number' },
  orders: { label: 'Pedidos', type: 'number' },
  ageTo: { label: 'Edad hasta', type: 'number' },
  birthDateFrom: { label: 'Fecha de nacimiento desde', type: 'date' },
  birthDateTo: { label: 'Fecha de nacimiento hasta', type: 'date' },
  createdAtFrom: { label: 'Creado desde', type: 'date' },
  createdAtTo: { label: 'Creado hasta', type: 'date' },
} as FormInfo<PatientParams>;

export const patientColumns: Column[] = [
  columnId,
  new Column('fullName', 'Nombre'),
  new Column('age', 'Edad'),
  new Column('sex', 'Sexo'),
  new Column('phoneNumber', 'Teléfono'),
  new Column('dateOfBirth', 'Fecha de nacimiento', { options: new ColumnOptions({ justify: 'end', }) }),
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

);

export const patientCells: PartialCellsOf<Patient> = {
  ...baseTableCells,
  age: new TableCellItem<number, 'age'>('age', 'badge', { unit: 'años', color: 'secondary' }),
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
  sex: new TableCellItem<string, 'sex'>('sex', 'sex'),
  phoneNumber: new TableCellItem<string, 'phoneNumber'>('phoneNumber', 'phoneNumber'),
  taxId: new TableCellItem<string, 'taxId'>('taxId', 'string'),
} as PartialCellsOf<Patient>;

