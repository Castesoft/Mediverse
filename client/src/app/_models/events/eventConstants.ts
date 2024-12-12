import { baseColumns, Column, columnCreatedAt, columnId } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { Event } from "src/app/_models/events/event";
import { EventParams } from "src/app/_models/events/eventParams";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { baseTableCells, PartialCellsOf, TableCellItem } from "src/app/_models/tables/tableCellItem";


export const eventFormInfo: FormInfo<Event> = {
  ...baseInfo,
  // allDay: { label: 'Todo el día', type: 'checkbox', },
  // dateFrom: { label: 'Fecha de inicio', type: 'date', },
  // dateTo: { label: 'Fecha de fin', type: 'date', },
  // evolution: { label: 'Evolución', type: 'textarea', },
  // nextSteps: { label: 'Próximos pasos', type: 'textarea', },
  // doctor: userInfo,
  // patient: userInfo,
  // service: serviceInfo,
  // clinic: addressInfo,
  // nurses: userInfo,
  // medicalInsuranceCompany: { label: 'Compañía de seguro médico', type: 'typeahead', },
  // paymentMethodType: { label: 'Método de pago', type: 'typeahead', },
  // payments: paymentInfo,
  // paymentStatus: { label: 'Estado de pago', type: 'typeahead', },
  // prescriptions: prescriptionInfo,
} as FormInfo<Event>;

export const eventFiltersFormInfo: FormInfo<EventParams> = {
  ...baseFilterFormInfo,
} as FormInfo<EventParams>;

export const eventDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'cita',
  'citas',
  'Citas',
  'events',
  ['inicio'],
);

export const eventColumns: Column[] = [
  columnId,
  new Column('patient', 'Paciente'),
  new Column('doctor', 'Doctor'),
  new Column('service', 'Servicio'),
  new Column('clinic', 'Clínica'),
  new Column('date', 'Fecha'),
  new Column('dateFrom', 'Inicio'),
  new Column('dateTo', 'Fin'),
  new Column('allDay', 'Todo el día'),
  new Column('evolution', 'Evolución'),
  new Column('nextSteps', 'Próximos pasos'),
  new Column('nursesCount', 'Enfermeras'),
  columnCreatedAt,
  // ...baseColumns,
];

export const eventCells: PartialCellsOf<Event> = {
  ...baseTableCells,

  allDay: new TableCellItem<boolean, 'allDay'>('allDay', 'boolean'),
  evolution: new TableCellItem<string, 'evolution'>('evolution', 'string'),
  nextSteps: new TableCellItem<string, 'nextSteps'>('nextSteps', 'string'),
  nursesCount: new TableCellItem<number, 'nursesCount'>('nursesCount', 'number'),

} as PartialCellsOf<Event>;
