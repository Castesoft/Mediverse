import { HttpParams } from "@angular/common/http";
import { inject, InputSignal } from "@angular/core";
import { FormGroup, AbstractControl, FormControl, AsyncValidatorFn, ValidatorFn, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { createId } from "@paralleldrive/cuid2";
import { ToastrService } from "ngx-toastr";
import { BadRequest, CatalogMode, Column, FormControlStyles, FormUse, View } from "src/app/_models/types";
import { EnvService } from "src/app/_services/env.service";
import { FormsService } from "src/app/_services/forms.service";
import { IconsService } from "src/app/_services/icons.service";
import { getPaginationHeaders } from "src/app/_utils/util";

export interface IParams {
  get httpParams(): HttpParams;
}

export class Entity {
  id = 0;
  createdAt = new Date();
  name = "";
  description = "";
  isSelected = false;
  visible = true;
  enabled = true;
}

export class DateRange {
  start: Date | null = null;
  end: Date | null = null;
}

export class EntityParams<T> {
  pageNumber = 1;
  pageSize = 10;
  search = "";
  sort = "createdAt";
  isSortAscending = true;
  dateFrom?: Date;
  dateTo?: Date;
  name = "";
  description = "";
  key: string;
  id = 0;

  constructor(key: string) {
    this.key = key;
  }
  // constructor(key: string, props?: { [K in keyof T]?: T[K] }) {
  //   this.key = key;

  //   if (props) {
  //     for (const prop in props) {
  //       (this as any)[prop] = props[prop as keyof T];
  //     }
  //   }
  // }

  protected value<U extends Entity>(template: { [K in keyof U]: U[K] }) {
    const value = new EntityParams<U>(this.key);

    for (const prop in template) {
      (value as any)[prop] = (this as any)[prop];
    }

    return value;
  }

  protected getHttpParams(): HttpParams {
    let params = getPaginationHeaders(this.pageNumber, this.pageSize);

    if (this.search) params = params.append("search", this.search);
    if (this.sort) params = params.append("sort", this.sort);
    if (typeof this.isSortAscending !== "undefined") params = params.append("isSortAscending", this.isSortAscending);
    if (this.dateFrom) params = params.append("dateFrom", this.dateFrom.toISOString());
    if (this.dateTo) params = params.append("dateTo", this.dateTo.toISOString());
    if (this.name) params = params.append("name", this.name);
    if (this.description) params = params.append("description", this.description);

    return params;
  }

  updateFromPartial(partial: Partial<T>) {
    Object.assign(this, partial);
  }

  get paramsValue(): string {
    return Object.keys(this).map(key => {
      const value = (this as any)[key];
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'string') {
          return value.join(',');
        } else if (value.length > 0 && typeof value[0] === 'object' && 'key' in value[0] && 'value' in value[0]) {
          return (value as SelectItem[]).map(item => item.value).join(',');
        }
      }
      return value;
    }).join('_');
  }
}

export interface ITypeaheadOptions {
  field: string;
  options: string[];
  scrollable: number;
  limit: number;
  async: boolean;
}

export class TypeaheadOptions implements ITypeaheadOptions {
  field = '';
  options: string[] = [];
  scrollable = 10;
  limit = 20;
  async = false;

  constructor(opts?: ITypeaheadOptions) {
    if (opts) {
      this.field = opts.field ? opts.field : '';
      this.options = opts.options ? opts.options : [];
      this.scrollable = opts.scrollable ? opts.scrollable : 10;
      this.limit = opts.limit ? opts.limit : 20;
      this.async = opts.async ? opts.async : false;
    }
  }
}

export type SelectItem = { key: string, value: string };

export type InputTypes =
  "text"
  | 'bull'
  | 'donor'
  | 'textarea'
  | 'check'
  | 'boolean'
  | 'slideToggle'
  | 'multiselect'
  | 'dateRange'
  | 'searchDate'
  | 'chips'
  | 'select'
  | "number"
  | "email"
  | "password"
  | "date"
  | "time"
  | "datetime-local"
  | "month"
  | "week"
  | "url"
  | "tel"
  | "search"
  | "hidden"
  | "color";

export type ControlErrors = { [key: string]: string };

export type ControlRows = 1 | 2 | 3 | 4 | 5 | "responsive";

export type ControlOrientation = 'inline' | 'block';

export class FormComponent<T> {
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected toastr = inject(ToastrService);
  protected formsService = inject(FormsService);
  protected matSnackBar = inject(MatSnackBar);
  dev = inject(EnvService);
  icons = inject(IconsService);

  service: T;

  constructor(serviceToken: new (...args: any[]) => T) {
    this.service = inject(serviceToken);
  }
}

export interface FormActions<T extends Entity, V extends Form<T>> {
  item: InputSignal<T | undefined>;
  use: InputSignal<FormUse>;
  view: InputSignal<View>;
  key: InputSignal<string>;

  form: V;

  onSubmit(): void;
  onCancel(): void;
  fillForm(): void;
  create(): void;
  update(item: T): void;
}

export interface FilterFormActions<T extends Entity, U extends EntityParams<U> & IParams, V extends Form<U>> {
  item: InputSignal<T | undefined>;
  use: InputSignal<FormUse>;
  view: InputSignal<View>;
  key: InputSignal<string>;
  mode: InputSignal<CatalogMode>;

  params?: U;
  form: V;

  onSubmit(): void;
  onCancel(): void;
}

export interface IControl<TValue> {
  type: InputTypes;
  label: string;
  name: string;
  placeholder?: string;
  value: TValue | null;
  options: SelectItem[];
  disabled: boolean;
  validators: ValidatorFn[];
  asyncValidators: AsyncValidatorFn[];
  helperText?: string;
  isReadonly: boolean;
  id: string;
  use: FormUse;
  submitted: boolean;
  touched: boolean;
  formControl: AbstractControl<TValue | null, TValue | null>;
  showLabel: boolean;
  hidden: boolean;
  optional: boolean;
  isNew: boolean;
  errors: ControlErrors;
  validation: boolean;
  orientation?: ControlOrientation;
  typeahead: ITypeaheadOptions;
  isGroupSpan: boolean;
  style: FormControlStyles;
  get required(): boolean;
  setValidation(validation: boolean): Control<TValue>;
  setOptions(options: SelectItem[], columns: Column[]): Control<TValue>;
  setValue(value: TValue): Control<TValue>;
  setValidators(validators: ValidatorFn[]): Control<TValue>;
  setAsyncValidators(asyncValidators: AsyncValidatorFn[]): Control<TValue>;

  // extension methods
  setTypeaheadOptions(options: string[]): Control<TValue>;
}

export class Control<TValue> implements IControl<TValue | null> {
  type: InputTypes;
  label: string;
  name: string;
  placeholder?: string;
  value: TValue | null = null;
  options: SelectItem[] = [];
  disabled = false;
  hidden = false;
  validators: ValidatorFn[] = [];
  asyncValidators: AsyncValidatorFn[] = [];
  helperText?: string;
  isReadonly = false;
  id: string;
  use: FormUse = 'detail';
  submitted = false;
  touched = false;
  formControl: AbstractControl<TValue | null, TValue | null>;
  style: FormControlStyles = 'solid';
  showLabel = true;
  optional = false;
  isNew = false;
  errors: ControlErrors = {};
  orientation?: ControlOrientation = 'block';
  validation = false;
  typeahead: ITypeaheadOptions = new TypeaheadOptions();
  isGroupSpan = false;

  constructor(
    type: InputTypes,
    label: string,
    name: string,
    opts?: {
      errors?: ControlErrors;
      isNew?: boolean;
      optional?: boolean;
      showLabel?: boolean;
      hidden?: boolean;
      placeholder?: string;
      value?: TValue;
      helperText?: string;
      options?: SelectItem[];
      submitted?: boolean;
      touched?: boolean;
      orientation?: ControlOrientation;
      typeahead?: ITypeaheadOptions;
      isGroupSpan?: boolean;
      id?: string;
      isReadonly?: boolean;
      disabled?: boolean;
      validators?: ValidatorFn[];
      asyncValidators?: AsyncValidatorFn[];
      style?: FormControlStyles;
    },
  ) {
    this.type = type;
    this.label = label;
    this.name = name;
    this.id = `${name}Control${createId()}`;
    this.formControl = new FormControl<TValue>({ value: opts?.value || (null as unknown as TValue), disabled: opts?.disabled || false });

    if (opts) {
      this.placeholder = opts.placeholder || undefined;
      this.helperText = opts.helperText || undefined;
      this.value = opts.value || (null as unknown as TValue);
      this.options = opts.options || [];
      this.disabled = opts.disabled || false;
      this.validators = opts.validators || [];
      this.asyncValidators = opts.asyncValidators || [];
      this.isReadonly = opts.isReadonly || false;
      this.id = opts.id || this.id;
      this.touched = opts.touched || false;
      this.orientation = opts.orientation || 'block';
      this.submitted = opts.submitted || false;
      this.showLabel = opts.showLabel || true;
      this.hidden = opts.hidden || false;
      this.optional = opts.optional || false;
      this.isNew = opts.isNew || false;
      this.errors = opts.errors || {};
      this.style = opts.style || 'solid';
      if (opts.typeahead) {
        this.typeahead = opts.typeahead;
      }
      this.isGroupSpan = opts.isGroupSpan || false;
    }
  }

  setOptions(options: SelectItem[] = [], columns: Column[] = [], isTypeahead = false): Control<TValue> {
    if (columns.length > 0) {
      this.options = columns.map(column => {
        return { key: column.name, value: column.label };
      });
      this.setValue(this.options[0].key as TValue);
    } else {
      this.options = options;
      if (isTypeahead) {
        this.typeahead = new TypeaheadOptions({
          ...this.typeahead, options: options.map(option => option.value)
        });
      }
    }
    return this;
  }

  setValue(value: TValue): Control<TValue> {
    this.value = value;
    this.formControl.setValue(value);
    this.formControl.updateValueAndValidity({ emitEvent: true });
    return this;
  }

  setValidation(validation: boolean): Control<TValue> {
    this.validation = validation;
    if (validation) {
      this.formControl.setValidators(this.validators);
      this.formControl.setAsyncValidators(this.asyncValidators);
    } else {
      this.formControl.clearValidators();
      this.formControl.clearAsyncValidators();
    }
    this.formControl.updateValueAndValidity({ emitEvent: true });
    return this;
  }

  get required(): boolean {
    return (this.validators.includes(Validators.required)) && (this.validation === true);
  }

  setValidators(validators: ValidatorFn[]): Control<TValue> {
    this.formControl.setValidators(validators);
    this.formControl.updateValueAndValidity({ emitEvent: true });
    return this;
  }

  setAsyncValidators(asyncValidators: AsyncValidatorFn[]): Control<TValue> {
    this.formControl.setAsyncValidators(asyncValidators);
    this.formControl.updateValueAndValidity({ emitEvent: true });
    return this;
  }

  setTypeaheadOptions(options: string[]): Control<TValue> {
    this.typeahead.options = options;
    return this;
  }

}

export interface IForm<T extends Record<keyof T, any>> {
  group: FormGroup<{ [K in keyof T]: AbstractControl<T[K] | null, T[K] | null>; }>;
  id: string;
  error?: BadRequest;
  submitted: boolean;
  validation: boolean;
  use: FormUse;
  isReadonly: boolean;
  controlOrientation?: ControlOrientation;
  columns?: Column[];

  get submittable(): boolean;
  get value(): { [K in keyof T]: T[K]; };

  controls: { [K in keyof T]: Control<T[K]> };

  getControl(key: keyof T): Control<T[keyof T]>;
  getControls(keys?: (keyof T)[]): { control: Control<T[keyof T]> }[];
  setValidation(validation: boolean): void;
  patchWithSample(): void;
  setUse(use: FormUse): void;
  setReadonlyToControls(readonly: boolean): void;
  onCancel(): void;
  reset(): void;
  patch(use: FormUse, value: { [K in keyof T]?: T[K] }): void;
  setTypeaheadOptions(key: keyof T, options: string[]): this;
}

export class Form<T extends Entity | EntityParams<T>> implements IForm<T> {
  group: FormGroup<{ [K in keyof T]: AbstractControl<T[K] | null, T[K] | null> }>;
  id = createId();
  error?: BadRequest;
  submitted = false;
  validation = true;
  use: FormUse = 'detail';
  isReadonly = false;
  controls: { [K in keyof T]: Control<T[K]> };
  controlOrientation?: ControlOrientation = 'inline';
  columns?: Column[];

  constructor(controls: { [K in keyof T]: Control<T[K]> }, opts?: {
    orientation?: ControlOrientation;
    style?: FormControlStyles;
    columns?: Column[];
  }) {
    // Initialize controls
    this.controls = controls;

    let formControls: { [K in keyof T]: AbstractControl<T[K] | null, T[K] | null> } = {} as any;

    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        const control = controls[key as keyof T];
        formControls[key as keyof T] = new FormControl<T[keyof T] | null>(
          { value: control.value, disabled: control.disabled } as any, // Note: `as any` used to avoid type error
          control.validators,
          control.asyncValidators
        );

        // Set the formControl property of each Control instance
        control.formControl = formControls[key as keyof T];
        if (opts) {
          control.orientation = opts.orientation || 'block';
          control.style = opts.style || 'solid';
        }

      }
    }
    this.group = new FormGroup(formControls);

    if (this.isEntityParamsType(controls) && opts?.columns && 'sort' in controls) {
      this.columns = opts.columns;
      const ctrls = controls as { [K in keyof EntityParams<T>]: Control<EntityParams<T>[K]> };
      ctrls['sort'].setOptions([], opts.columns);
      ctrls['sort'].value = opts.columns[0].label as any;
    }

    // for(const key in this.group.controls) {
    //   this.group.controls[key].valueChanges.subscribe({
    //     next: (value) => {
    //       console.log('value', value);

    //       // this.controls[key as keyof T] = this.controls[key as keyof T].setValue(value);
    //     }
    //   });
    // }
  }
  setTypeaheadOptions(key: keyof T, options: string[]): this {
    this.controls[key].setTypeaheadOptions(options);
    return this;
  }

  private isEntityParamsType(controls: { [K in keyof T]: Control<T[K]> }): boolean {
    // Replace 'pageNumber' with any unique property name from EntityParams
    return 'pageNumber' in controls;
  }

  get value(): T {
    const value: { [K in keyof T]: T[K]; } = {} as any;

    for (const key in this.controls) {
      value[key as keyof T] = this.group.controls[key]?.value;
    }

    return value;
  }

  get submittable(): boolean {
    if (this.validation) {
      return this.group.valid;
    } else {
      return true;
    }
  }

  patch(use: FormUse, value: { [K in keyof T]?: T[K] }): void {
    if (use === 'create') this.reset();
    else this.group.patchValue(value as any);

    if (this.isEntityParamsType(this.controls) && this.columns && 'sort' in this.controls) {
      // const ctrls = this.controls as { [K in keyof EntityParams<T>]: Control<EntityParams<T>[K]> };
      // ctrls['sort'].setOptions([], opts.columns);
      // ctrls['sort'].value = opts.columns[0].label as any;

      this.group.get('sort')?.setValue(this.columns[0].label as any);
    }
  }

  getControl(key: keyof T): Control<T[keyof T]> {
    return this.controls[key];
  }

  getControls(keys?: (keyof T)[]): { control: Control<T[keyof T]> }[] {
    if (!keys) {
      return Object.keys(this.controls).map(key => {
        return { control: this.controls[key as keyof T] };
      });
    } else {
      return keys.map(key => {
        return { control: this.controls[key] };
      });
    }
  }

  setValidation(validation: boolean): void {
    this.validation = validation;
    if (validation) {
      for(const key in this.controls) {
        let control = this.controls[key as keyof T];
        control.validation = validation;
        this.group.get(key)?.setValidators(control.validators);
        this.group.get(key)?.setAsyncValidators(control.asyncValidators);
      }
    } else {
      this.group.clearValidators();
      this.group.clearAsyncValidators();
    }

    this.group.updateValueAndValidity({ emitEvent: true});
  }

  patchWithSample(): void {
    this.group.patchValue({});
  }

  setUse(use: FormUse): void {
    this.use = use;
    this.error = undefined;
    if (use === "detail") {
      this.group.disable({ emitEvent: false, onlySelf: true });
      this.isReadonly = true;
    }
    if (use === "edit" || use === "create") {
      this.group.enable({ emitEvent: false, onlySelf: true });
      for(const key in this.controls) {
        if (this.controls[key as keyof T].disabled) this.group.get(key)?.disable({ emitEvent: false, onlySelf: true });
      }
      this.isReadonly = false;
    }
    this.setReadonlyToControls(this.isReadonly);
  }

  setReadonlyToControls(readonly: boolean): void {
    for (const key in this.controls) {
      this.controls[key as keyof T].isReadonly = readonly;
    }
  }
  onCancel(): void {
    this.submitted = false;
    this.group.reset({ emitEvent: false, onlySelf: true } as any);
    this.group.markAsPristine({ emitEvent: false, onlySelf: true } as any);
  }

  reset(): void {
    this.group.reset({ emitEvent: false, onlySelf: true } as any);
    this.group.markAsPristine({ emitEvent: false, onlySelf: true } as any);
  }

  onSubmit(): void {
    this.submitted = true;
    for(const key in this.controls) {
      // console.log('key', key);
      // console.log('control', this.controls[key as keyof T]);
      // console.log('formControl', this.group.controls[key]);
      this.controls[key as keyof T].formControl = this.group.controls[key] as AbstractControl<T[keyof T] | null, T[keyof T] | null>;
      this.controls[key as keyof T].submitted = true;
    }
  }
}
