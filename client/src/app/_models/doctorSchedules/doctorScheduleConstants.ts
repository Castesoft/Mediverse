import { Validators } from "@angular/forms";
import { doctorResultInfo } from "../doctors/doctorResults/doctorResultConstants";
import { DoctorSchedule } from "src/app/_models/doctorSchedules/doctorSchedule";
import { FormInfo } from "src/app/_models/forms/formTypes";


export const doctorScheduleFormInfo: FormInfo<DoctorSchedule> = {
  clinic: { type: 'typeahead', label: 'Clínica', showCodeSpan: false, showLabel: false, validators: [Validators.required] },

  dateFrom: { type: 'date', label: 'Fecha desde', validators: [Validators.required] },
  dateTo: { type: 'date', label: 'Fecha hasta', validators: [Validators.required] },

  timeFrom: { type: 'text', label: 'Hora desde', validators: [Validators.required] },
  timeTo: { type: 'text', label: 'Hora hasta', validators: [Validators.required] },

  doctor: doctorResultInfo,

  hasPatientInformationAccess: { type: 'checkbox', label: 'Acceso a información del paciente' },
  medicalInsuranceCompany: { type: 'typeahead', label: 'Compañía de seguros médicos', showCodeSpan: false, },
  paymentMethodType: { type: 'typeahead', label: 'Tipo de método de pago', showCodeSpan: false, },
  service: { type: 'typeahead', label: 'Servicio', showCodeSpan: false, showLabel: false, validators: [Validators.required] },

  stripePaymentMethodId: { type: 'text', label: 'ID del método de pago de Stripe' },
} as FormInfo<DoctorSchedule>;
