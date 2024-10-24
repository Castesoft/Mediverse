import { Validators } from "@angular/forms";
import { SelectOption } from "src/app/_forms/form";
import { FormInfo, FormGroup2, FormControl2 } from "src/app/_forms/form2";
import { Address } from "src/app/_models/address";
import { AvailableDay } from "src/app/_models/availableDay";
import { DoctorResult, doctorResultInfo } from "src/app/_models/doctorResult";
import { MedicalInsuranceCompany } from "src/app/_models/medicalInsuranceCompany";
import { Service } from "src/app/_models/service";

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
  clinic: { type: 'typeahead', label: 'Clínica' },

  dateFrom: { type: 'date', label: 'Fecha desde', validators: [Validators.required] },
  dateTo: { type: 'date', label: 'Fecha hasta', validators: [Validators.required] },

  timeFrom: { type: 'text', label: 'Hora desde', validators: [Validators.required] },
  timeTo: { type: 'text', label: 'Hora hasta', validators: [Validators.required] },

  doctor: doctorResultInfo,

  hasPatientInformationAccess: { type: 'checkbox', label: 'Acceso a información del paciente' },
  medicalInsuranceCompany: { type: 'select', label: 'Compañía de seguros médicos' },
  paymentMethodType: { type: 'select', label: 'Tipo de método de pago' },
  service: { type: 'typeahead', label: 'Servicio' },

  stripePaymentMethodId: { type: 'text', label: 'ID del método de pago de Stripe' },
} as FormInfo<DoctorSchedule>;

export class DoctorScheduleForm extends FormGroup2<DoctorSchedule> {

  constructor() {
    super(DoctorSchedule, new DoctorSchedule(), doctorScheduleInfo);
  }

  patch(value: DoctorResult, selectedSchedule: AvailableDay) {
    console.log('value:', value);

    const doctor = new DoctorResult({ ...value, });

    this.controls.doctor.patchValue(doctor);

    this.controls.clinic.selectOptions = doctor.addresses.map(address => {
      const constructedAddress = new Address({ ...address });

      return new SelectOption({ id: constructedAddress.id!, name: constructedAddress.address, code: constructedAddress.address, enabled: constructedAddress.enabled, visible: constructedAddress.visible });
    });

    this.controls.service.selectOptions = doctor.services.map(service => {
      const constructedService = new Service({ ...service });

      return new SelectOption({ id: constructedService.id!, name: constructedService.name, code: constructedService.name, enabled: constructedService.enabled, visible: constructedService.visible });
    });

    this.controls.medicalInsuranceCompany.selectOptions = doctor.medicalInsuranceCompanies.map(medicalInsuranceCompany => {
      const constructedMedicalInsuranceCompany = new MedicalInsuranceCompany({ ...medicalInsuranceCompany });

      return new SelectOption({ id: constructedMedicalInsuranceCompany.id!, name: constructedMedicalInsuranceCompany.name, code: constructedMedicalInsuranceCompany.name, enabled: constructedMedicalInsuranceCompany.enabled, visible: constructedMedicalInsuranceCompany.visible });
    });

    if (selectedSchedule) {

      this.controls.dateFrom.patchValue(new Date(selectedSchedule.year!, selectedSchedule.monthNumber! - 1, selectedSchedule.dayNumber!));
      this.controls.dateTo.patchValue(new Date(selectedSchedule.year!, selectedSchedule.monthNumber! - 1, selectedSchedule.dayNumber!));

      this.controls.timeFrom.patchValue(selectedSchedule.availableTimes[0].start);
      this.controls.timeTo.patchValue(selectedSchedule.availableTimes[0].end);
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
