import { Column, columnCreatedAt } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { clinicFormInfo } from 'src/app/_models/clinics/clinicConstants';
import { doctorFormInfo } from 'src/app/_models/doctors/doctorConstants';
import Event from "src/app/_models/events/event";
import { EventParams } from "src/app/_models/events/eventParams";
import { EventFormSteps } from 'src/app/_models/events/eventTypes';
import DateOptions from 'src/app/_models/forms/dateOptions';
import { FormInfo } from "src/app/_models/forms/formTypes";
import MaterialOptions from 'src/app/_models/forms/materialOptions';
import { nurseFormInfo } from 'src/app/_models/nurses/nurseConstants';
import { patientFormInfo } from 'src/app/_models/patients/patientConstants';
import { paymentFormInfo } from 'src/app/_models/payments/paymentConstants';
import { prescriptionFormInfo } from 'src/app/_models/prescriptions/prescriptionConstants';
import { serviceFormInfo } from 'src/app/_models/services/serviceConstants';
import { baseTableCells, PartialCellsOf, TableCellItem } from "src/app/_models/tables/tableCellItem";


export const eventFormInfo: FormInfo<Event> = {
  ...baseInfo,
  allDay: { label: 'Todo el día', type: 'checkbox', },
  dateFrom: {
    label: 'Fecha de inicio',
    type: 'date',
    showLabel: false,
    materialOptions: new MaterialOptions({ appearance: 'fill', }),
    dateOptions: new DateOptions({ hideToggleButton: true, })
  },
  dateTo: {
    label: 'Fecha de fin',
    type: 'date',
    showLabel: false,
    materialOptions: new MaterialOptions({ appearance: 'fill', }),
    dateOptions: new DateOptions({ hideToggleButton: true, })
  },
  evolution: { label: 'Evolución', type: 'textarea', },
  nextSteps: { label: 'Próximos pasos', type: 'textarea', },
  doctor: doctorFormInfo,
  patient: patientFormInfo,
  service: serviceFormInfo,
  clinic: clinicFormInfo,
  nurses: nurseFormInfo,
  medicalInsuranceCompany: { label: 'Compañía de seguro médico', type: 'typeahead', },
  paymentMethodType: { label: 'Método de pago', type: 'typeahead', },
  payments: paymentFormInfo,
  paymentStatus: { label: 'Estado de pago', type: 'typeahead', },
  prescriptions: prescriptionFormInfo,
} as FormInfo<Event>;

export const eventFiltersFormInfo: FormInfo<EventParams> = {
  ...baseFilterFormInfo,
  clinics: {
    label: 'Clínicas',
    type: 'multiselect',
    materialOptions: new MaterialOptions({ appearance: 'fill', }),
    showCodeSpan: false,
  },
  nurses: {
    label: 'Especialistas',
    type: 'multiselect',
    materialOptions: new MaterialOptions({ appearance: 'fill', }),
    showCodeSpan: false,
  },
  patients: {
    label: 'Pacientes',
    type: 'multiselect',
    materialOptions: new MaterialOptions({ appearance: 'fill', }),
    showCodeSpan: false,
  },
  services: {
    label: 'Servicios',
    type: 'multiselect',
    materialOptions: new MaterialOptions({ appearance: 'fill', }),
    showCodeSpan: false,
  },
} as FormInfo<EventParams>;

export const eventDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'cita',
  'citas',
  'Citas',
  'events'
);

export const eventColumns: Column[] = [
  new Column('date', 'Fecha'),
  new Column('patient', 'Paciente'),
  new Column('doctor', 'Doctor'),
  new Column('service', 'Servicio'),
  new Column('clinic', 'Clínica'),
  new Column('evolution', 'Evolución'),
  new Column('nextSteps', 'Próximos pasos'),
  new Column('nursesCount', 'Enfermeras'),
  columnCreatedAt,
];

export const eventCells: PartialCellsOf<Event> = {
  ...baseTableCells,

  allDay: new TableCellItem<boolean, 'allDay'>('allDay', 'boolean'),
  evolution: new TableCellItem<string, 'evolution'>('evolution', 'string'),
  nextSteps: new TableCellItem<string, 'nextSteps'>('nextSteps', 'string'),
  nursesCount: new TableCellItem<number, 'nursesCount'>('nursesCount', 'number'),

} as PartialCellsOf<Event>;

export const eventFormSteps: Record<number, EventFormSteps> = {
  0: 'paciente',
  1: 'horario',
  2: 'servicio',
  3: 'especialistas',
  4: 'clinica',
};

export class EventsTableDisplayRole {
  static readonly DOCTOR = 'doctor';
  static readonly PATIENT = 'patient';
}
