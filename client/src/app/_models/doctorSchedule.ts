import { Validators } from "@angular/forms";
import { Options, SelectOption } from "src/app/_forms/form";
import { FormInfo, FormGroup2, FormControl2 } from "src/app/_forms/form2";
import { Address } from "src/app/_models/address";
import { AvailableDay } from "src/app/_models/availableDay";
import { DoctorResult, doctorResultInfo } from "src/app/_models/doctorResult";
import { PaymentMethodType } from "src/app/_models/paymentMethodType";
import { Service } from "src/app/_models/service";
import { MedicalInsuranceCompany } from "src/app/medicalInsuranceCompanies/medicalInsuranceCompanies.config";

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
  clinic: { type: 'typeahead', label: 'Clínica', showCodeSpan: false, },

  dateFrom: { type: 'date', label: 'Fecha desde', validators: [Validators.required] },
  dateTo: { type: 'date', label: 'Fecha hasta', validators: [Validators.required] },

  timeFrom: { type: 'text', label: 'Hora desde', validators: [Validators.required] },
  timeTo: { type: 'text', label: 'Hora hasta', validators: [Validators.required] },

  doctor: doctorResultInfo,

  hasPatientInformationAccess: { type: 'checkbox', label: 'Acceso a información del paciente' },
  medicalInsuranceCompany: { type: 'typeahead', label: 'Compañía de seguros médicos', showCodeSpan: false, },
  paymentMethodType: { type: 'typeahead', label: 'Tipo de método de pago', showCodeSpan: false, },
  service: { type: 'typeahead', label: 'Servicio', showCodeSpan: false, },

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

      let optionToReturn = new SelectOption({ id: constructedService.id!,
        name: constructedService.name!,
        code: constructedService.name!,
        enabled: constructedService.enabled,
        visible: constructedService.visible,
      });

      if (service.options && service.options.price) {
        optionToReturn.options = new Options({ price: service.options.price });
      }

      // console.log(constructedService, service);

      return optionToReturn;
    });

    this.controls.medicalInsuranceCompany.selectOptions = doctor.medicalInsuranceCompanies.map(medicalInsuranceCompany => {
      const constructedMedicalInsuranceCompany = new MedicalInsuranceCompany({ ...medicalInsuranceCompany });

      let optionToReturn = new SelectOption({ id: constructedMedicalInsuranceCompany.id!,
        name: constructedMedicalInsuranceCompany.name!,
        code: constructedMedicalInsuranceCompany.name!,
        enabled: constructedMedicalInsuranceCompany.enabled,
        visible: constructedMedicalInsuranceCompany.visible });

      if (medicalInsuranceCompany.options && medicalInsuranceCompany.options.photoUrl) {
        optionToReturn.options = new Options({ photoUrl: medicalInsuranceCompany.options.photoUrl });
      }

      return optionToReturn;
    });

    this.controls.paymentMethodType.selectOptions = doctor.paymentMethods.map(paymentMethod => {
      const constructedPaymentMethod = new PaymentMethodType({ ...paymentMethod });

      return new SelectOption({ id: constructedPaymentMethod.id!, name: constructedPaymentMethod.name!, code: constructedPaymentMethod.name!, enabled: constructedPaymentMethod.enabled, visible: constructedPaymentMethod.visible });
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
        code: address.code!,
        enabled: address.enabled,
        id: address.id!,
        name: address.name!,
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

  get payload(): DoctorScheduleFormPayload {
    const payload = new DoctorScheduleFormPayload();

    payload.setFromForm(this);

    return payload;
  }

}
