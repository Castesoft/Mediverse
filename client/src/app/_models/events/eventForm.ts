import { SelectOption } from 'src/app/_models/base/selectOption';
import Event from "src/app/_models/events/event";
import { eventFormInfo } from "src/app/_models/events/eventConstants";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";


export class EventForm extends FormGroup2<Event> {

  private _patientOptions: SelectOption[] = [];
  private _clinicOptions: SelectOption[] = [];
  private _serviceOptions: SelectOption[] = [];
  private _nurseOptions: SelectOption[] = [];

  get patientOptions(): SelectOption[] {
    return this._patientOptions;
  }

  get clinicOptions(): SelectOption[] {
    return this._clinicOptions;
  }

  get serviceOptions(): SelectOption[] {
    return this._serviceOptions;
  }

  get nurseOptions(): SelectOption[] {
    return this._nurseOptions;
  }

  setPatientOptions(options: SelectOption[]): this {
    this._patientOptions = options;
    this.controls.patient.controls.select.selectOptions = options;
    return this;
  }

  setClinicOptions(options: SelectOption[]): this {
    if (!this.controls.clinic) return this;
    this._clinicOptions = options;
    this.controls.clinic.controls.select.selectOptions = options;
    return this;
  }

  setServiceOptions(options: SelectOption[]): this {
    this._serviceOptions = options;
    this.controls.service.controls.select.selectOptions = options;
    return this;
  }

  setNurseOptions(options: SelectOption[]): this {
    this._nurseOptions = options;
    this.controls.nurseOptions.selectOptions = options;
    return this;
  }

  constructor() {
    super(Event, new Event(), eventFormInfo);

    this.controls.dateFrom.valueChanges.subscribe({
      next: (value: Date | null) => {
        this.controls.dateTo.dateOptions.matTimepickerMin = value;

        this.controls.dateTo.dateOptions.dateFilter = (date: Date | null) => {
          if (!date || !value) return false;

          const selectedMin = new Date(value);
          const currentDate = new Date(date);

          // Compare only the date portion (ignoring time)
          const minDate = new Date(selectedMin.getFullYear(), selectedMin.getMonth(), selectedMin.getDate());
          const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

          return checkDate.getTime() >= minDate.getTime();
        };

        if (this.controls.dateTo.value === null) {
          this.controls.dateTo.patchValue(value);
        }

      }
    });

    this.controls.service.controls.select.valueChanges.subscribe({
      next: (value: SelectOption | null) => {
        if (value !== null) {
          this.controls.service.controls.id.patchValue(value.id);
        }
      }
    });

    this.controls.patient.controls.select.valueChanges.subscribe({
      next: (value: SelectOption | null) => {
        if (value !== null) {
          this.controls.patient.controls.id.patchValue(value.id);
        }
      }
    });

    this.controls.clinic?.controls.select.valueChanges.subscribe({
      next: (value: SelectOption | null) => {
        if (value !== null) {
          this.controls.clinic?.controls.id.patchValue(value.id);
        }
      }
    });
  }

  get hasPatient(): boolean {
    return this.controls.patient.controls.select.value !== null;
  }

  get hasClinic(): boolean {
    return this.controls.clinic?.controls.select.value !== null;
  }

  get hasService(): boolean {
    return this.controls.service.controls.select.value !== null;
  }

  get hasNurses(): boolean {
    return this.controls.nurseOptions.value === null ? false : this.controls.nurseOptions.value.length > 0;
  }

  removePatient(): void {
    this.controls.patient.controls.select.patchValue(null);
  }

  removeClinic(): void {
    this.controls.clinic?.controls.select.patchValue(null);
  }

  removeService(): void {
    this.controls.service.controls.select.patchValue(null);
  }

  removeNurses(): void {
    this.controls.nurseOptions.patchValue([]);
  }

}
