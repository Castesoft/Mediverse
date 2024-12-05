import { AvailableDay } from "src/app/_models/availableDay";
import { Options } from "src/app/_models/base/options";
import { SelectOption } from "src/app/_models/base/selectOption";
import { DoctorResult } from "../doctorResults/doctorResult";
import { doctorScheduleFormInfo } from "./doctorScheduleConstants";
import { DoctorSchedule } from "src/app/_models/doctorSchedules/doctorSchedule";
import { DoctorScheduleFormPayload } from "src/app/_models/doctorSchedules/doctorScheduleFormPayload";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { MedicalInsuranceCompany } from "src/app/_models/medicalInsuranceCompanies/medicalInsuranceCompany";
import { PaymentMethodType } from "../paymentMethodTypes/paymentMethodType";
import { Service } from "src/app/_models/services/service";
import { Address } from "src/app/_models/addresses/address";

export class DoctorScheduleForm extends FormGroup2<DoctorSchedule> {

  constructor() {
    super(DoctorSchedule, new DoctorSchedule(), doctorScheduleFormInfo);
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

      let optionToReturn = new SelectOption({
        id: constructedService.id!,
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

      let optionToReturn = new SelectOption({
        id: constructedMedicalInsuranceCompany.id!,
        name: constructedMedicalInsuranceCompany.name!,
        code: constructedMedicalInsuranceCompany.name!,
        enabled: constructedMedicalInsuranceCompany.enabled,
        visible: constructedMedicalInsuranceCompany.visible
      });

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
