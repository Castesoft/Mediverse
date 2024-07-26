import { HttpParams } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { createId } from "@paralleldrive/cuid2";
import {BadRequest} from "src/app/_models/types";
import { ProductsService } from "src/app/_services/products.service";
import { getPaginationHeaders } from "src/app/_utils/util";

const subject = 'product';

export class Product {
  id!: number;
  name!: string;
  description!: string;
  quantity!: string;
  unit!: string;
  discount!: number;
  price!: number;
  photoUrl?: string;
  createdAt!: Date;
  isSelected = false;
}

export interface ProductSummary {
  id: number;
  name: string;
  description: string;
}

export class ProductParams {
  pageNumber = 1;
  pageSize = 10;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sort = 'createdAt';
  isSortAscending = false;
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

  updateFromPartial(partial: Partial<ProductParams>) {
    Object.assign(this, partial);
  }

  setFromFormGroup(group: FormGroup) {
    this.pageSize = group.controls['pageSize'].value;
    this.search = group.controls['search'].value;
  }

  update(group: FormGroup, service: ProductsService, key: string) {
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

  patchValue(params: ProductParams) {
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
      name: new FormControl(''),
      description: new FormControl(''),
      price: new FormControl(''),
      discount: new FormControl(''),
    });
  }

  setValidators(mode: boolean) {
    const controls = this.group.controls;

    if (mode) {
      controls['name'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
      controls['description'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
      controls['price'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
      controls['discount'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255), Validators.email]);
    } else {
      controls['name'].clearValidators(); controls['name'].clearAsyncValidators();
      controls['description'].clearValidators(); controls['description'].clearAsyncValidators();
      controls['price'].clearValidators(); controls['price'].clearAsyncValidators();
      controls['discount'].clearValidators(); controls['discount'].clearAsyncValidators();
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
      price: new FormControl(''),
      discount: new FormControl(''),
    });
  }

  setValidators(mode: boolean) {
    const controls = this.group.controls;

    if (mode) {
      controls['name'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
      controls['description'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
      controls['price'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
      controls['discount'].addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(255), Validators.email]);
    } else {
      controls['name'].clearValidators(); controls['name'].clearAsyncValidators();
      controls['description'].clearValidators(); controls['description'].clearAsyncValidators();
      controls['price'].clearValidators(); controls['price'].clearAsyncValidators();
      controls['discount'].clearValidators(); controls['discount'].clearAsyncValidators();
    }
    // this.group.updateValueAndValidity();
  }

  patchValues = (item: Product) => this.group.patchValue(item);
}

export class DetailForm {
  group: FormGroup;
  id: string;
  error?: BadRequest;
  submitted = false;
  validation = true;

  patchValues = (item: Product) => this.group.patchValue(item);

  constructor() {
    this.id = `${subject}Form${createId()}`;

    this.group = new FormGroup({
      name: new FormControl({ value: '', disabled: true }),
      description: new FormControl({ value: '', disabled: true }),
      discount: new FormControl({ value: '', disabled: true }),
      price: new FormControl({ value: '', disabled: true }),
    });
  }
}
