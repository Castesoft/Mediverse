import { Patient } from "src/app/_models/patient";
import { PaymentBilling } from "src/app/_models/payment";
import { Doctor } from "src/app/_models/user";

export enum AppointmentKind {
  Consultation = 'Consulta',
  FollowUp = 'Seguimiento',
  Emergency = 'Emergencia',
}

export enum AppointmentStatus {
  Scheduled = 'Agendada',
  Completed = 'Completada',
  Canceled = 'Cancelada',
  NoShow = 'No se presentó',
}

export interface Appointment {
  id: number;
  date: Date;
  time: Date;
  patient: Patient;
  doctor: Doctor;
  kind: AppointmentKind;
  status: AppointmentStatus;
  paymentBilling: PaymentBilling;
}
