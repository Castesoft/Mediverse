import { HttpParams } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { createId } from "@paralleldrive/cuid2";
import { Service } from "src/app/_models/service";
import { BadRequest, Role } from "src/app/_models/types";
import { User, UserSummary } from "src/app/_models/user";
import { EventsService } from "src/app/_services/events.service";
import { getPaginationHeaders } from "src/app/_utils/util";
import { Address } from "src/app/addresses/addresses.config";
import { PaymentMethodType } from './paymentMethodType';
import { MedicalInsuranceCompany } from './medicalInsuranceCompany';
import { Payment } from './payment';
import { Prescription } from './prescription';

const subject = 'event';

export class Event {
  id!: number;

  allDay = false;
  dateFrom = new Date();
  dateTo = new Date();

  patient?: User;
  doctor?: User;
  service?: Service;
  clinic?: Address;
  nurses?: User[];
  paymentMethodType?: PaymentMethodType;
  medicalInsuranceCompany?: MedicalInsuranceCompany;
  payments?: Payment[];
  evolution?: string;
  nextSteps?: string;
  prescriptions?: Prescription[];
  paymentStatus?: PaymentStatus;

  createdAt!: Date;
  isSelected = false;
}

export class PaymentStatus {
  name!: string;
  color!: string;
}

export class EventSummary {
  id!: number;
  allDay = false;
  dateFrom = new Date();
  dateTo = new Date();
  patient?: UserSummary;
}

export class EventParams {
  pageNumber = 1;
  pageSize = 10;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sort = 'createdAt';
  isSortAscending = false;
  isCalendarView = false;
  role?: Role;
  key?: string;

  // other
  sex?: string;

  constructor(key: string) {
    this.key = key;
  }

  toHttpParams(): HttpParams {
    let params = getPaginationHeaders(this.pageNumber, this.pageSize);

    if (this.key) params = params.append('id', this.key);
    if (this.search) params = params.append('search', this.search);
    if (this.role) params = params.append('role', this.role);
    if (this.dateFrom)
      params = params.append(
        'dateFrom',
        this.dateFrom.toISOString(),
      );
    if (this.dateTo)
      params = params.append(
        'dateTo',
        this.dateTo.toISOString(),
      );
    if (this.sort) params = params.append('sort', this.sort);
    if (this.isSortAscending)
      params = params.append('isSortAscending', this.isSortAscending);
    if (this.pageSize) {
      params = params.append('pageSize', this.pageSize.toString());
    }
    if (this.isCalendarView) params = params.append('isCalendarView', this.isCalendarView);

    if (this.sex) params = params.append('sex', this.sex);

    return params;
  }

  updateFromPartial(partial: Partial<EventParams>) {
    Object.assign(this, partial);
  }

  setFromFormGroup(group: FormGroup) {
    this.pageSize = group.controls['pageSize'].value;
    this.search = group.controls['search'].value;
  }

  update(group: FormGroup, service: EventsService, key: string) {
    this.setFromFormGroup(group);
    service.setParam$(key, this);
  }
}

export class FilterForm {
  group: FormGroup;
  id: string;

  constructor() {
    this.id = `${subject}filterForm${createId()}`;
    this.group = new FormGroup({
      search: new FormControl(''),
      dateRange: new FormControl({ value: ['', ''], disabled: false }),
      pageSize: new FormControl(10, [
        Validators.required,
        Validators.min(1),
        Validators.max(50),
      ]),
      sex: new FormControl(''),
    });
  }

  patchValue(params: EventParams) {
    const dateRange = [params.dateFrom, params.dateTo];

    this.group.patchValue(
      {
        search: params.search,
        dateRange,
        pageSize: params.pageSize ?? 10,
        sex: params.sex
      },
      { emitEvent: false, onlySelf: true },
    );
  }
}

export class CreateForm {
  group: FormGroup;
  id: string;
  error?: BadRequest;
  submitted = false;
  validation = true;

  constructor() {
    this.id = `${subject}Form${createId()}`;

    this.group = new FormGroup({
      patientId: new FormControl(''),
      nursesIds: new FormControl(''),
      serviceId: new FormControl(''),
      clinicId: new FormControl(''),
      dateTime: new FormGroup({
        allDay: new FormControl(false),
        dateFrom: new FormControl(''),
        dateTo: new FormControl(''),
        timeFrom: new FormControl(''),
        timeTo: new FormControl(''),
      })
    });
  }

  setValidators(mode: boolean) {
    const controls = this.group.controls;

    if (mode) {
      controls['firstName'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
      controls['lastName'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
      controls['dateOfBirth'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
      controls['email'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255), Validators.email]);
      controls['sex'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
    } else {
      controls['firstName'].clearValidators();
      controls['firstName'].clearAsyncValidators();
      controls['lastName'].clearValidators();
      controls['lastName'].clearAsyncValidators();
      controls['dateOfBirth'].clearValidators();
      controls['dateOfBirth'].clearAsyncValidators();
      controls['email'].clearValidators();
      controls['email'].clearAsyncValidators();
      controls['sex'].clearValidators();
      controls['sex'].clearAsyncValidators();
    }
    // this.group.updateValueAndValidity();
  }

  patchWithSample() {
    // let sample = getRandomSample();
    // this.group.patchValue(sample);
  }

  getRequest() {
    return {
      patientId: this.group.value.patientId,
      nursesIds: this.group.value.nursesIds,
      serviceId: this.group.value.serviceId,
      clinicId: this.group.value.clinicId,
      allDay: this.group.value.dateTime.allDay,
      dateFrom: new Date(this.group.value.dateTime.dateFrom),
      dateTo: new Date(this.group.value.dateTime.dateTo),
      timeFrom: this.group.value.dateTime.timeFrom === '' ? '00:00' : this.group.value.dateTime.timeFrom,
      timeTo: this.group.value.dateTime.timeTo === '' ? '23:59' : this.group.value.dateTime.timeTo,
    };
  }

}

export class EditForm {
  group: FormGroup;
  id: string;
  error?: BadRequest;
  submitted = false;
  validation = true;

  constructor() {
    this.id = `${subject}Form${createId()}`;

    this.group = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      dateOfBirth: new FormControl(''),
      email: new FormControl(''),
      sex: new FormControl(''),
      allDay: new FormControl(false),
      dateFrom: new FormControl(''),
      dateTo: new FormControl(''),
      timeFrom: new FormControl(''),
      timeTo: new FormControl(''),
    });
  }

  setValidators(mode: boolean) {
    const controls = this.group.controls;

    if (mode) {
      controls['firstName'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
      controls['lastName'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
      controls['dateOfBirth'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
      controls['email'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255), Validators.email]);
      controls['sex'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
    } else {
      controls['firstName'].clearValidators();
      controls['firstName'].clearAsyncValidators();
      controls['lastName'].clearValidators();
      controls['lastName'].clearAsyncValidators();
      controls['dateOfBirth'].clearValidators();
      controls['dateOfBirth'].clearAsyncValidators();
      controls['email'].clearValidators();
      controls['email'].clearAsyncValidators();
      controls['sex'].clearValidators();
      controls['sex'].clearAsyncValidators();
    }
    // this.group.updateValueAndValidity();
  }

  patchValues = (item: Event) => this.group.patchValue(item);

  getRequest() {
    return {
      patientId: this.group.value.patientId,
      nursesIds: this.group.value.nursesIds,
      serviceId: this.group.value.serviceId,
      clinicId: this.group.value.clinicId,
      allDay: this.group.value.dateTime.allDay,
      dateFrom: this.group.value.dateTime.dateFrom,
      dateTo: this.group.value.dateTime.dateTo,
      timeFrom: this.group.value.dateTime.timeFrom,
      timeTo: this.group.value.dateTime.timeTo,
    };
  }
}

export class DetailForm {
  group: FormGroup;
  id: string;
  error?: BadRequest;
  submitted = false;
  validation = true;

  patchValues = (item: Event) => this.group.patchValue(item);

  constructor() {
    this.id = `${subject}Form${createId()}`;

    this.group = new FormGroup({
      firstName: new FormControl({ value: '', disabled: true }),
      lastName: new FormControl({ value: '', disabled: true }),
      email: new FormControl({ value: '', disabled: true }),
      dateOfBirth: new FormControl({ value: '', disabled: true }),
      sex: new FormControl({ value: '', disabled: true }),
      allDay: new FormControl({ value: '', disabled: true }),
      dateFrom: new FormControl({ value: '', disabled: true }),
      dateTo: new FormControl({ value: '', disabled: true }),
      timeFrom: new FormControl({ value: '', disabled: true }),
      timeTo: new FormControl({ value: '', disabled: true }),
    });
  }
}

export class EventDoctorFields {
  addresses!: Address[];
}
