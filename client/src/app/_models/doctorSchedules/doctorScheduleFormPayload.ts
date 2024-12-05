import { SelectOption } from "src/app/_models/base/selectOption";
import { DoctorScheduleForm } from "./doctorScheduleForm";


export class DoctorScheduleFormPayload {
  service: SelectOption | null = null;
  clinic: SelectOption | null = null;
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  timeFrom: string | null = null;
  timeTo: string | null = null;
  doctor: SelectOption | null = null;
  paymentMethodType: SelectOption | null = null;
  medicalInsuranceCompany: SelectOption | null = null;
  hasPatientInformationAccess: boolean | null = null;
  stripePaymentMethodId: string | null = null;

  constructor(init?: Partial<DoctorScheduleFormPayload>) {
    Object.assign(this, init);
  }

  setFromForm(form: DoctorScheduleForm) {
    this.service = form.controls.service.value;
    this.clinic = form.controls.clinic.value;
    this.dateFrom = form.controls.dateFrom.value;
    this.dateTo = form.controls.dateTo.value;
    this.timeFrom = form.controls.timeFrom.value;
    this.timeTo = form.controls.timeTo.value;
    if (form.controls.doctor.value.id) {
      this.doctor = new SelectOption({ id: form.controls.doctor.value.id });
    }
    this.paymentMethodType = form.controls.paymentMethodType.value;
    this.medicalInsuranceCompany = form.controls.medicalInsuranceCompany.value;
    this.hasPatientInformationAccess = form.controls.hasPatientInformationAccess.value;
    this.stripePaymentMethodId = form.controls.stripePaymentMethodId.value;
  }
}
