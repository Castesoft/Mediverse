import { createId } from "@paralleldrive/cuid2";
import { SelectOption } from 'src/app/_models/base/selectOption';
import { eventFiltersFormInfo } from "src/app/_models/events/eventConstants";
import { EventParams } from "src/app/_models/events/eventParams";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";

export class EventFiltersForm extends FormGroup2<EventParams> {

  private _clinicOptions: SelectOption[] = [];
  private _patientOptions: SelectOption[] = [];
  private _serviceOptions: SelectOption[] = [];
  private _nurseOptions: SelectOption[] = [];

  setClinicOptions(options: SelectOption[]): this {
    this._clinicOptions = options;
    this.controls.clinics.selectOptions = options;
    return this;
  }

  setPatientOptions(options: SelectOption[]): this {
    this._patientOptions = options;
    this.controls.patients.selectOptions = options;
    return this;
  }

  setServiceOptions(options: SelectOption[]): this {
    this._serviceOptions = options;
    this.controls.services.selectOptions = options;
    return this;
  }

  setNurseOptions(options: SelectOption[]): this {
    this._nurseOptions = options;
    this.controls.nurses.selectOptions = options;
    return this;
  }

  constructor() {
    super(EventParams as any, new EventParams(createId()), eventFiltersFormInfo);
  }
}
