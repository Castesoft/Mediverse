import {HttpParams} from "@angular/common/http";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {createId} from "@paralleldrive/cuid2";
import {BadRequest, Role} from "src/app/_models/types";
import {UsersService} from "src/app/_services/users.service";
import {getPaginationHeaders} from "src/app/_utils/util";

const subject = 'user';

export class User {
  id!: number;
  username!: string;
  firstName!: string;
  lastName!: string;
  fullName!: string;
  email!: string;
  isEmailVerified = false;
  phoneNumber?: string;
  phoneNumberCountryCode?: string;
  isPhoneNumberVerified = false;
  hasAccount = false;
  age!: number;
  sex!: string;
  photoUrl?: string;
  dateOfBirth!: Date;
  createdAt!: Date;
  isSelected = false;

  taxId?: string;

  roles: string[] = [];
  permissions: string[] = [];

  eventsCount = 0;
  eventsAmount = 0;
  eventsPayable = 0;

  street!: string;
  exteriorNumber!: string;
  interiorNumber?: string;
  neighborhood?: string;
  city!: string;
  state!: string;
  country!: string;
  zipcode!: string;

  post?: string;
  education?: string;


}

export class UserParams {
  pageNumber = 1;
  pageSize = 10;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sort = 'createdAt';
  isSortAscending = false;

  key?: string;
  role?: Role;

  // other
  sex?: string;

  constructor(key: string) {
    this.key = key;
  }

  toHttpParams(): HttpParams {
    let params = getPaginationHeaders(this.pageNumber, this.pageSize);

    if (this.key) params = params.append('id', this.key);
    if (this.role) params = params.append('role', this.role);
    if (this.search) params = params.append('search', this.search);
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

    if (this.sex) params = params.append('sex', this.sex);

    return params;
  }

  updateFromPartial(partial: Partial<UserParams>) {
    Object.assign(this, partial);
  }

  setFromFormGroup(group: FormGroup) {
    this.pageSize = group.controls['pageSize'].value;
    this.search = group.controls['search'].value;
  }

  update(group: FormGroup, service: UsersService, key: string) {
    this.setFromFormGroup(group);
    service.setParam$(key, this);
  }
}

export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: Date;
  email: string;
  sex: string;
  age: string;
  photoUrl: string;
}


export class FilterForm {
  group: FormGroup;
  id: string;

  constructor() {
    this.id = `${subject}filterForm${createId()}`;
    this.group = new FormGroup({
      search: new FormControl(''),
      dateRange: new FormControl({value: ['', ''], disabled: false}),
      pageSize: new FormControl(10, [
        Validators.required,
        Validators.min(1),
        Validators.max(50),
      ]),
      sex: new FormControl(''),
    });
  }

  patchValue(params: UserParams) {
    const dateRange = [params.dateFrom, params.dateTo];

    this.group.patchValue(
      {
        search: params.search,
        dateRange,
        pageSize: params.pageSize ?? 10,
        sex: params.sex
      },
      {emitEvent: false, onlySelf: true},
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
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      dateOfBirth: new FormControl(''),
      email: new FormControl(''),
      phoneNumber: new FormControl(''),
      sex: new FormControl(''),
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
      controls['phoneNumber'].addValidators([Validators.required, Validators.minLength(8), Validators.maxLength(14)]);
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
      controls['phoneNumber'].clearValidators();
      controls['phoneNumber'].clearAsyncValidators();
    }
    // this.group.updateValueAndValidity();
  }

  patchWithSample() {
    // let sample = getRandomSample();
    // this.group.patchValue(sample);
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
      phoneNumber: new FormControl(''),
      sex: new FormControl(''),
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
      controls['phoneNumber'].addValidators([Validators.required, Validators.minLength(8), Validators.maxLength(14)]);
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
      controls['phoneNumber'].clearValidators();
      controls['phoneNumber'].clearAsyncValidators();
    }
    // this.group.updateValueAndValidity();
  }

  patchValues = (item: User) => this.group.patchValue(item);
}

export class DetailForm {
  group: FormGroup;
  id: string;
  error?: BadRequest;
  submitted = false;
  validation = true;

  patchValues = (item: User) => this.group.patchValue(item);

  constructor() {
    this.id = `${subject}Form${createId()}`;

    this.group = new FormGroup({
      firstName: new FormControl({value: '', disabled: true}),
      lastName: new FormControl({value: '', disabled: true}),
      email: new FormControl({value: '', disabled: true}),
      dateOfBirth: new FormControl({value: '', disabled: true}),
      sex: new FormControl({value: '', disabled: true}),
    });
  }
}
