import { HttpParams } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { createId } from "@paralleldrive/cuid2";
import {Addresses, BadRequest, Role} from "src/app/_models/types";
import { AddressesService } from "src/app/_services/addresses.service";
import { getPaginationHeaders } from "src/app/_utils/util";

const subject = 'address';

export class Address {
  id!: number;
  name!: string;
  description?: string;
  street!: string;
  exteriorNumber!: string;
  interiorNumber?: string;
  neighborhood?: string;
  city!: string;
  state!: string;
  country!: string;
  zipcode!: string;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;

  nursesCount = 0;
  isMain = false;

  createdAt!: Date;
  isSelected = false;
}

export class AddressParams {
  pageNumber = 1;
  pageSize = 10;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sort = 'createdAt';
  isSortAscending = false;

  key?: string;
  type?: Addresses;

  constructor(key: string) {
    this.key = key;
  }

  toHttpParams(): HttpParams {
    let params = getPaginationHeaders(this.pageNumber, this.pageSize);

    if (this.key) params = params.append('id', this.key);
    if (this.type) params = params.append('type', this.type);
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

    return params;
  }

  updateFromPartial(partial: Partial<AddressParams>) {
    Object.assign(this, partial);
  }

  setFromFormGroup(group: FormGroup) {
    this.pageSize = group.controls['pageSize'].value;
    this.search = group.controls['search'].value;
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
    });
  }

  patchValue(params: AddressParams) {
    const dateRange = [params.dateFrom, params.dateTo];

    this.group.patchValue(
      {
        search: params.search,
        dateRange,
        pageSize: params.pageSize ?? 10,
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
      name: new FormControl(''),
      description: new FormControl(''),
      street: new FormControl(''),
      exteriorNumber: new FormControl(''),
      interiorNumber: new FormControl(''),
      zipcode: new FormControl(''),
      neighborhood: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl('México'),
      isMain: new FormControl(false),
    });
  }

  setValidators(mode: boolean) {
    const controls = this.group.controls;

    if (mode) {
      controls['name'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
      controls['description'].addValidators([Validators.minLength(2), Validators.maxLength(255)]);
      controls['street'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
      controls['exteriorNumber'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255), Validators.email]);
      controls['interiorNumber'].addValidators([Validators.minLength(2), Validators.maxLength(255)]);
      controls['zipcode'].addValidators([Validators.required, Validators.minLength(5), Validators.maxLength(7)]);
      controls['neighborhood'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100)]);
      controls['city'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100)]);
      controls['state'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100)]);
      controls['country'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100)]);
    } else {
      controls['name'].clearValidators(); controls['name'].clearAsyncValidators();
      controls['description'].clearValidators(); controls['description'].clearAsyncValidators();
      controls['street'].clearValidators(); controls['street'].clearAsyncValidators();
      controls['exteriorNumber'].clearValidators(); controls['exteriorNumber'].clearAsyncValidators();
      controls['interiorNumber'].clearValidators(); controls['interiorNumber'].clearAsyncValidators();
      controls['zipcode'].clearValidators(); controls['zipcode'].clearAsyncValidators();
      controls['neighborhood'].clearValidators(); controls['neighborhood'].clearAsyncValidators();
      controls['city'].clearValidators(); controls['city'].clearAsyncValidators();
      controls['state'].clearValidators(); controls['state'].clearAsyncValidators();
      controls['country'].clearValidators(); controls['country'].clearAsyncValidators();
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
      name: new FormControl(''),
      description: new FormControl(''),
      street: new FormControl(''),
      exteriorNumber: new FormControl(''),
      interiorNumber: new FormControl(''),
      zipcode: new FormControl(''),
      neighborhood: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
      isMain: new FormControl(false),
    });
  }

  setValidators(mode: boolean) {
    const controls = this.group.controls;

    if (mode) {
      controls['name'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
      controls['description'].addValidators([Validators.minLength(2), Validators.maxLength(255)]);
      controls['street'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
      controls['exteriorNumber'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255), Validators.email]);
      controls['interiorNumber'].addValidators([Validators.minLength(2), Validators.maxLength(255)]);
      controls['zipcode'].addValidators([Validators.required, Validators.minLength(5), Validators.maxLength(7)]);
      controls['neighborhood'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100)]);
      controls['city'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100)]);
      controls['state'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100)]);
      controls['country'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100)]);
    } else {
      controls['name'].clearValidators(); controls['name'].clearAsyncValidators();
      controls['description'].clearValidators(); controls['description'].clearAsyncValidators();
      controls['street'].clearValidators(); controls['street'].clearAsyncValidators();
      controls['exteriorNumber'].clearValidators(); controls['exteriorNumber'].clearAsyncValidators();
      controls['interiorNumber'].clearValidators(); controls['interiorNumber'].clearAsyncValidators();
      controls['zipcode'].clearValidators(); controls['zipcode'].clearAsyncValidators();
      controls['neighborhood'].clearValidators(); controls['neighborhood'].clearAsyncValidators();
      controls['city'].clearValidators(); controls['city'].clearAsyncValidators();
      controls['state'].clearValidators(); controls['state'].clearAsyncValidators();
      controls['country'].clearValidators(); controls['country'].clearAsyncValidators();
    }
    // this.group.updateValueAndValidity();
  }

  patchValues = (item: Address) => this.group.patchValue(item);
}

export class DetailForm {
  group: FormGroup;
  id: string;
  error?: BadRequest;
  submitted = false;
  validation = true;

  patchValues = (item: Address) => this.group.patchValue(item);

  constructor() {
    this.id = `${subject}Form${createId()}`;

    this.group = new FormGroup({
      name: new FormControl({ value: '', disabled: true }),
      description: new FormControl({ value: '', disabled: true }),
      street: new FormControl({ value: '', disabled: true }),
      exteriorNumber: new FormControl({ value: '', disabled: true }),
      interiorNumber: new FormControl({ value: '', disabled: true }),
      zipcode: new FormControl({ value: '', disabled: true }),
      neighborhood: new FormControl({ value: '', disabled: true }),
      city: new FormControl({ value: '', disabled: true }),
      state: new FormControl({ value: '', disabled: true }),
      country: new FormControl({ value: '', disabled: true }),
    });
  }
}
