import { Column, columnCreatedAt, columnId } from 'src/app/_models/base/column';
import { baseInfo } from 'src/app/_models/base/entity';
import { baseFilterFormInfo } from 'src/app/_models/base/entityParams';
import { NamingSubject } from 'src/app/_models/base/namingSubject';
import { FormInfo } from 'src/app/_models/forms/formTypes';
import { ColumnOptions } from 'src/app/_models/forms/options/columnOptions';
import Nurse from 'src/app/_models/nurses/nurse';
import { NurseParams } from 'src/app/_models/nurses/nurseParams';
import { baseTableCells, PartialCellsOf, TableCellItem } from 'src/app/_models/tables/tableCellItem';
import { Validators } from "@angular/forms";
import { sexOptions } from "src/app/_models/patients/patientConstants";

export const nurseFormInfo: FormInfo<Nurse> = {
  ...baseInfo,
  select: { label: 'Especialista', type: 'multiselect', },
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
} as FormInfo<Nurse>;

export const nurseFiltersFormInfo: FormInfo<NurseParams> = {
  ...baseFilterFormInfo,
} as FormInfo<NurseParams>;

export const nurseColumns: Column[] = [
  columnId,
  new Column('fullName', 'Nombre'),
  new Column('email', 'Correo electrónico'),
  new Column('phoneNumber', 'Teléfono'),
  new Column('age', 'Edad'),
  new Column('sex', 'Sexo'),
  new Column('dateOfBirth', 'Fecha de nacimiento', { options: new ColumnOptions({ justify: 'end', }) }),
  new Column('taxId', 'RFC'),
  new Column('eventsCount', 'Citas'),
  columnCreatedAt,
];

export const nurseDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'especialista',
  'especialistas',
  'Especialistas',
  'nurses',
);

export const nurseCells: PartialCellsOf<Nurse> = {
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
  phoneNumber: new TableCellItem<string, 'phoneNumber'>('phoneNumber', 'string'),
  taxId: new TableCellItem<string, 'taxId'>('taxId', 'string'),
} as PartialCellsOf<Nurse>;


