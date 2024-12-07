import { SelectOption } from "src/app/_models/base/selectOption";
import { DoctorResult } from "../doctors/doctorResults/doctorResult";

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
