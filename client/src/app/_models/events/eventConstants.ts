import { baseColumns, Column } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { Event } from "src/app/_models/events/event";
import { EventParams } from "src/app/_models/events/eventParams";
import { FormInfo } from "src/app/_models/forms/formTypes";


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
  ['home', 'events'],
);

export const eventColumns: Column[] = [
  ...baseColumns,
];
