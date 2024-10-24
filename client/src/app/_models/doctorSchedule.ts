import { Validators } from "@angular/forms";
import { SelectOption } from "src/app/_forms/form";
import { FormInfo, FormGroup2, FormControl2 } from "src/app/_forms/form2";
import { DoctorResult, doctorResultInfo } from "src/app/_models/doctorResult";

export class DoctorSchedule {
  doctor: DoctorResult = new DoctorResult();
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  timeFrom: string | null = null;
  timeTo: string | null = null;
  clinic: SelectOption | null = null;
  service: SelectOption | null = null;
  medicalInsuranceCompany: SelectOption | null = null;
  paymentMethodType: SelectOption | null = null;
  hasPatientInformationAccess = false;
  stripePaymentMethodId: string | null = null;

  constructor(init?: Partial<DoctorSchedule>) {
    Object.assign(this, init);
  }
}

export const doctorScheduleInfo: FormInfo<DoctorSchedule> = {
  clinic: { type: 'select', label: 'Clínica' },

  dateFrom: { type: 'date', label: 'Fecha desde', validators: [Validators.required] },
  dateTo: { type: 'date', label: 'Fecha hasta', validators: [Validators.required] },

  timeFrom: { type: 'text', label: 'Hora desde', validators: [Validators.required] },
  timeTo: { type: 'text', label: 'Hora hasta', validators: [Validators.required] },

  doctor: doctorResultInfo,

  hasPatientInformationAccess: { type: 'checkbox', label: 'Acceso a información del paciente' },
  medicalInsuranceCompany: { type: 'select', label: 'Compañía de seguros médicos' },
  paymentMethodType: { type: 'select', label: 'Tipo de método de pago' },
  service: { type: 'select', label: 'Servicio' },

  stripePaymentMethodId: { type: 'text', label: 'ID del método de pago de Stripe' },
} as FormInfo<DoctorSchedule>;

export class DoctorScheduleForm extends FormGroup2<DoctorSchedule> {

  constructor() {
    super(DoctorSchedule, new DoctorSchedule(), doctorScheduleInfo);
  }

  patch(value: DoctorResult, selectedSchedule: any) {
    this.controls.doctor.patchValue(new DoctorResult({...value!}));

    if (selectedSchedule) {

      this.controls.dateFrom.patchValue(new Date(selectedSchedule.day.year, selectedSchedule.day.monthNumber - 1, selectedSchedule.day.dayNumber));
      this.controls.dateTo.patchValue(new Date(selectedSchedule.day.year, selectedSchedule.day.monthNumber - 1, selectedSchedule.day.dayNumber));

      this.controls.timeFrom.patchValue(selectedSchedule.time.start);
      this.controls.timeTo.patchValue(selectedSchedule.time.end);
    }

    if (value!.addresses.length === 1) {
      const address = value!.addresses[0]!;

      this.controls.clinic.patchValue(new SelectOption({
        code: address.code,
        enabled: address.enabled,
        id: address.id!,
        name: address.name,
        visible: address.visible,
      }));
    }

    if (value!.services.length === 1) {
      this.controls.service.patchValue(new SelectOption({ ...value!.services[0] }));
    }

    if (value!.medicalInsuranceCompanies.length === 1) {
      this.controls.medicalInsuranceCompany.patchValue(new SelectOption({ ...value!.medicalInsuranceCompanies[0] }));
    }

    if (value!.paymentMethods.length === 1) {
      this.controls.paymentMethodType.patchValue(new SelectOption({ ...value!.paymentMethods[0] }));
    }

    if (value!.hasPatientInformationAccess) {
      const hasPatientInformationAccessControl = this.controls.hasPatientInformationAccess as FormControl2<boolean>;
      hasPatientInformationAccessControl.patchValue(true);
    }
  }

}
