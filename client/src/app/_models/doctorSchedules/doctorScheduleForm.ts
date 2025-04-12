import { Address } from 'src/app/_models/addresses/address';
import { AvailableDay } from 'src/app/_models/availableDay';
import { AvailableTime } from 'src/app/_models/availableTime';
import { Options } from 'src/app/_models/base/options';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { DoctorResult } from 'src/app/_models/doctors/doctorResults/doctorResult';
import { DoctorSchedule } from 'src/app/_models/doctorSchedules/doctorSchedule';
import { doctorScheduleFormInfo } from 'src/app/_models/doctorSchedules/doctorScheduleConstants';
import { DoctorScheduleFormPayload } from 'src/app/_models/doctorSchedules/doctorScheduleFormPayload';
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';
import { MedicalInsuranceCompany } from 'src/app/_models/medicalInsuranceCompanies/medicalInsuranceCompany';
import { PaymentMethodType } from 'src/app/_models/paymentMethodTypes/paymentMethodType';
import { Service } from 'src/app/_models/services/service';

export class DoctorScheduleForm extends FormGroup2<DoctorSchedule> {

  doctorResult: DoctorResult | null = null;

  constructor() {
    super(DoctorSchedule, new DoctorSchedule(), doctorScheduleFormInfo);
  }

  setDoctorResult(value: DoctorResult | null): this {
    if (value === null) throw new Error('Doctor result is null');

    this.doctorResult = new DoctorResult({ ...value, });

    return this;
  }

  patchDoctor(): this {
    if (this.doctorResult === null) throw new Error('Doctor result is not set');

    this.controls.doctor.patchValue(this.doctorResult);

    this.controls.hasPatientInformationAccess.patchValue(this.doctorResult.hasPatientInformationAccess);

    return this;
  }

  patchClinics(): this {
    if (this.doctorResult === null) throw new Error('Doctor result is not set');

    this.controls.clinic.selectOptions = this.doctorResult.addresses.map(address => {
      const constructedAddress = new Address({ ...address });

      return new SelectOption({ id: constructedAddress.id!, name: constructedAddress.address, code: constructedAddress.address, enabled: constructedAddress.isEnabled, visible: constructedAddress.isVisible });
    });

    if (this.doctorResult!.addresses.length === 1) {
      const address = this.doctorResult!.addresses[0]!;

      this.controls.clinic.patchValue(new SelectOption({
        code: address.code!,
        enabled: address.isEnabled,
        id: address.id!,
        name: address.name!,
        visible: address.isVisible,
      }));
    }

    return this;
  }

  patchServices(): this {
    if (this.doctorResult === null) throw new Error('Doctor result is not set');

    this.controls.service.selectOptions = this.doctorResult.services.map(service => {
      const constructedService = new Service({ ...service });

      let optionToReturn = new SelectOption({
        id: constructedService.id!,
        name: constructedService.name!,
        code: constructedService.name!,
        enabled: constructedService.isEnabled,
        visible: constructedService.isVisible,
      });

      if (service.options && service.options.price) {
        optionToReturn.options = new Options({ price: service.options.price });
      }

      return optionToReturn;
    });

    if (this.doctorResult!.services.length === 1) {
      this.controls.service.patchValue(new SelectOption({ ...this.doctorResult!.services[0] }));
    }

    return this;
  }

  patchMedicalInsuranceCompanies(): this {
    if (this.doctorResult === null) throw new Error('Doctor result is not set');

    this.controls.medicalInsuranceCompany.selectOptions = this.doctorResult.medicalInsuranceCompanies.map(medicalInsuranceCompany => {
      const constructedMedicalInsuranceCompany = new MedicalInsuranceCompany({ ...medicalInsuranceCompany });

      let optionToReturn = new SelectOption({
        id: constructedMedicalInsuranceCompany.id!,
        name: constructedMedicalInsuranceCompany.name!,
        code: constructedMedicalInsuranceCompany.name!,
        enabled: constructedMedicalInsuranceCompany.isEnabled,
        visible: constructedMedicalInsuranceCompany.isVisible
      });

      if (medicalInsuranceCompany.options && medicalInsuranceCompany.options.photoUrl) {
        optionToReturn.options = new Options({ photoUrl: medicalInsuranceCompany.options.photoUrl });
      }

      return optionToReturn;
    });

    if (this.doctorResult!.medicalInsuranceCompanies.length === 1) {
      this.controls.medicalInsuranceCompany.patchValue(new SelectOption({ ...this.doctorResult!.medicalInsuranceCompanies[0] }));
    }

    return this;
  }

  patchPaymentMethods(): this {
    if (this.doctorResult === null) throw new Error('Doctor result is not set');

    
    const activePaymentMethods = this.doctorResult.paymentMethods
      .map(paymentMethod => {
        
        const constructedPaymentMethod = new PaymentMethodType({ ...paymentMethod });
        return new SelectOption({
          id: constructedPaymentMethod.id!,
          name: constructedPaymentMethod.name!,
          code: constructedPaymentMethod.name!,
          enabled: constructedPaymentMethod.isEnabled,
          visible: constructedPaymentMethod.isVisible,
          isActive: paymentMethod.isActive 
        });
      })
      .filter(option => option.isActive); 

    this.controls.paymentMethodType.selectOptions = activePaymentMethods;

    
    if (activePaymentMethods.length === 1) {
      this.controls.paymentMethodType.patchValue(activePaymentMethods[0]);
    }


    return this;
  }

  patchSchedule(value: AvailableDay | null): this {
    if (value !== null) {
      this.controls.dateFrom.patchValue(new Date(value.year!, value.monthNumber! - 1, value.dayNumber!));
      this.controls.dateTo.patchValue(new Date(value.year!, value.monthNumber! - 1, value.dayNumber!));
    } else {
      this.controls.dateFrom.patchValue(null);
      this.controls.dateTo.patchValue(null);
    }

    return this;
  }

  patchTime(value: AvailableTime | null): this {
    if (value !== null) {
      this.controls.timeFrom.patchValue(value.start);
      this.controls.timeTo.patchValue(value.end);
    } else {
      this.controls.timeFrom.patchValue(null);
      this.controls.timeTo.patchValue(null);
    }

    return this;
  }

  patch(value: DoctorResult, selectedSchedule: AvailableDay) {
    // this.controls.dateFrom.patchValue(new Date(selectedSchedule.year!, selectedSchedule.monthNumber! - 1, selectedSchedule.dayNumber!));
    // this.controls.dateTo.patchValue(new Date(selectedSchedule.year!, selectedSchedule.monthNumber! - 1, selectedSchedule.dayNumber!));

    // if (selectedSchedule.selectedTime.start !== null && selectedSchedule.selectedTime.start !== undefined)
    // this.controls.timeFrom.patchValue(selectedSchedule.selectedTime.start);

    // if (selectedSchedule.selectedTime.end !== null)
    // this.controls.timeTo.patchValue(selectedSchedule.selectedTime.end);
  }

  get payload(): DoctorScheduleFormPayload {
    const payload = new DoctorScheduleFormPayload();

    payload.setFromForm(this);

    return payload;
  }

  /*

  <div class="stepper-desc fw-semibold">{{selectedSchedule()!.day }} {{selectedSchedule()!.dayNumber }} de
                  {{selectedSchedule()!.month}} del {{selectedSchedule()!.year}}</div>

  */
  get dateText(): string {
    if (this.controls.dateFrom.value === null) return 'Seleccione una fecha';

    return `${this.controls.dateFrom.value.getDate()} de ${this.controls.dateFrom.value.toLocaleString('default', { month: 'long' })} del ${this.controls.dateFrom.value.getFullYear()}`;
  }

  get timeText(): string {
    if (this.controls.timeFrom.value === null || this.controls.timeTo.value === null) return 'Seleccione una hora';

    return `De las ${this.controls.timeFrom.value} a las ${this.controls.timeTo.value}`;
  }

  get hasDateAndTime(): boolean {
    return this.controls.dateFrom.value !== null &&
      this.controls.dateTo.value !== null &&
      this.controls.timeFrom.value !== null &&
      this.controls.timeTo.value !== null
    ;
  }

}
