import { inject, InputSignal } from "@angular/core";
import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, FormControl, FormControlOptions, FormControlState, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { createId } from "@paralleldrive/cuid2";
import { ToastrService } from "ngx-toastr";
import { BadRequest, CatalogMode, Column, Entity, EntityParams, FormUse, IParams, Sex, View } from "src/app/_models/types";
import { EnvService } from "src/app/_services/env.service";
import { FormsService } from "src/app/_services/forms.service";
import { IconsService } from "src/app/_services/icons.service";
import { FormGroup2 } from "src/app/_forms/form2";

export function isSelectOption(value: any): value is SelectOption {
  return (
    value &&
    typeof value === 'object' &&
    'id' in value &&
    typeof value.id === 'number' &&
    'code' in value &&
    typeof value.code === 'string' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'enabled' in value &&
    typeof value.enabled === 'boolean' &&
    'visible' in value &&
    typeof value.visible === 'boolean'
  );
}

export class Options {
  sex: string | null = null;
  race: string | null = null;
  price: number | null = null;
  photoUrl: string | null = null;

  constructor(init?: Partial<Options>) {
    Object.assign(this, init);
  }
}

export class SelectOption {
  id = 0;
  code: string = '';
  name: string = '';
  enabled: boolean = true;
  visible: boolean = true;
  propiedad = null;
  options: Options | null = null;

  constructor(init?: Partial<SelectOption>, obj?: any) {
    Object.assign(this, init);

    if (!this.code) {
      this.code = this.name;
    }

    if (!this.name) {
      this.name = this.code;
    }

    if (obj) {
      this.id = obj.id;
      this.code = obj.code;
      this.name = obj.name;
    }
  }
}

export type InputTypes =
  "text"
  | "textMat"
  | "bull"
  | "donor"
  | "textarea"
  | "boolean"
  | "checkbox"
  | "slideToggle"
  | "multiselect"
  | "dateRange"
  | "searchDate"
  | "chips"
  | "selectMat"
  | "select"
  | "selectPair"
  | "numberMat"
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
  | "typeahead"
  | "select2"
  | "color"
  | "radioChips"
  | "radio"
  | "file"
  | "check"
  ;

export type ControlErrors = { [key: string]: string };

export type ControlRows = 1 | 2 | 3 | 4 | 5 | "responsive";

export type ControlOrientation = "inline" | "block";

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

export interface FormGroupActions<T extends Entity, V extends FormGroup2<T>> {
  item: InputSignal<T | undefined>;
  use: InputSignal<FormUse>;
  view: InputSignal<View>;
  key: InputSignal<string>;

  form: V;

  onSubmit(): void;

  onCancel(): void;

  create(): void;

  update(item: T): void;
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

export interface FilterFormGroupActions<T extends Entity, U extends EntityParams<U> & IParams, V extends FormGroup2<U>> {
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
  options: SelectOption[];
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
  isGroupSpan: boolean;
  showCodeSpan: boolean;

  get required(): boolean;

  setValidation(validation: boolean): Control<TValue>;

  setOptions(options: SelectOption[], columns: Column[]): Control<TValue>;

  setValue(value: TValue): Control<TValue>;

  setValidators(validators: ValidatorFn[]): Control<TValue>;

  setAsyncValidators(asyncValidators: AsyncValidatorFn[]): Control<TValue>;
}

export class Control<TValue> implements IControl<TValue | null> {
  type: InputTypes;
  label: string;
  name: string;
  placeholder?: string;
  value: TValue | null = null;
  options: SelectOption[] = [];
  disabled = false;
  hidden = false;
  validators: ValidatorFn[] = [];
  asyncValidators: AsyncValidatorFn[] = [];
  helperText?: string;
  isReadonly = false;
  id: string;
  use: FormUse = "detail";
  submitted = false;
  touched = false;
  formControl: AbstractControl<TValue | null, TValue | null>;
  showLabel = true;
  optional = false;
  isNew = false;
  errors: ControlErrors = {};
  orientation?: ControlOrientation = "block";
  validation = false;
  isGroupSpan = false;
  useOptionAsValue = false;
  showCodeSpan = true;

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
      options?: SelectOption[];
      submitted?: boolean;
      touched?: boolean;
      orientation?: ControlOrientation;
      isGroupSpan?: boolean;
      id?: string;
      isReadonly?: boolean;
      disabled?: boolean;
      validators?: ValidatorFn[];
      asyncValidators?: AsyncValidatorFn[];
      useOptionAsValue?: boolean;
      showCodeSpan?: boolean;
      formControl?: AbstractControl<TValue | null, TValue | null>;
    }
  ) {
    this.type = type;
    this.label = label;
    this.name = name;
    this.id = `${name}Control${createId()}`;
    this.formControl = new FormControl<TValue>({
      value: opts?.value || (null as unknown as TValue),
      disabled: opts?.disabled || false
    });

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
      this.orientation = opts.orientation || "block";
      this.submitted = opts.submitted || false;
      if (opts.showLabel !== undefined) {
        this.showLabel = opts.showLabel;
      }
      if (opts.showCodeSpan !== undefined) {
        this.showCodeSpan = opts.showCodeSpan;
      }
      this.hidden = opts.hidden || false;
      this.optional = opts.optional || false;
      this.isNew = opts.isNew || false;
      this.errors = opts.errors || {};
      this.useOptionAsValue = opts.useOptionAsValue || false;
      this.isGroupSpan = opts.isGroupSpan || false;
    }
  }

  setOptions(options: SelectOption[] = [], columns: Column[] = [], isTypeahead = false): Control<TValue> {
    if (columns.length > 0) {
      this.options = columns.map(column => {
        return new SelectOption({ code: column.name, name: column.label, });
      });
      this.setValue(this.options[0] as TValue);
    } else {
      this.options = options;
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

}

export class ControlBuilder<T extends string | number | Date | SelectOption | boolean> {
  id: string = createId();

  constructor(type: InputTypes, label: string, name: string, init?: Partial<ControlBuilder<T>>) {
    Object.assign(this, init);

    this.type = type;
    this.label = label;
    this.name = name;
  }

  formControl: AbstractControl<T | null, T | null> = new FormControl<T | null>(null);
  type: InputTypes;
  label: string;
  name: string;
  placeholder?: string;
  value: T | null = null;
  options: SelectOption[] = [];
  disabled: boolean = false;
  validators: ValidatorFn[] = [];
  asyncValidators: AsyncValidatorFn[] = [];
  helperText?: string;
  isReadonly: boolean = false;
  use: FormUse = 'detail';
  submitted: boolean = false;
  touched: boolean = false;
  showLabel: boolean = true;
  hidden: boolean = false;
  optional: boolean = false;
  isNew: boolean = false;
  errors: ControlErrors = {};
  validation: boolean = false;
  orientation: ControlOrientation = 'block';
  isGroupSpan: boolean = false;
  showCodeSpan: boolean = true;

  get required(): boolean {
    return (this.validators.includes(Validators.required)) && (this.validation === true);
  }

  setValidation(validation: boolean): ControlBuilder<T> {
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

  setOptions(options: SelectOption[], columns: Column[]): ControlBuilder<T> {
    if (columns.length > 0) {
      this.options = columns.map(column => {
        return new SelectOption({ code: column.name, name: column.label, });
      });
      this.setValue(this.options[0] as T);
    } else {
      this.options = options;
    }
    return this;
  }

  setValue(value: T): ControlBuilder<T> {
    this.value = value;
    this.formControl.setValue(value);
    this.formControl.updateValueAndValidity({ emitEvent: true });
    return this;
  }

  setValidators(validators: ValidatorFn[]): ControlBuilder<T> {
    this.formControl.setValidators(validators);
    this.formControl.updateValueAndValidity({ emitEvent: true });
    return this;
  }

  setAsyncValidators(asyncValidators: AsyncValidatorFn[]): ControlBuilder<T> {
    this.formControl.setAsyncValidators(asyncValidators);
    this.formControl.updateValueAndValidity({ emitEvent: true });
    return this;
  }
}

export class FormBuilder<T extends object> {
  id: string = createId();

  constructor(createInstance: new (init?: Partial<T>) => T, instance?: T, init?: Partial<FormBuilder<T>>) {
    Object.assign(this, init);

    this.controls = createTypedFormBuilder<T>(createInstance, instance);
    this.group = createTypedFormGroup<T>(createInstance, instance);
  }

  controls: TypedFormBuilder<T>;
  group: FormGroup<TypedForm<T>>;
  error?: BadRequest;
  submitted: boolean = false;
  validation: boolean = true;
  use: FormUse = 'detail';
  isReadonly: boolean = false;
  orientation?: ControlOrientation = 'block';
  columns: Column[] = [];
  loaded: boolean = false;

  get submittable(): boolean {
    if (this.validation) {
      return this.group.valid;
    } else {
      return true;
    }
  }

  get value(): T {
    return this.group.value as any;
  }

  setValidation(validation: boolean): void {
    this.validation = validation;
    if (validation) {
      for (const key in this.controls) {
        let control = this.controls[key as keyof T];
        // control.validation = validation;
        // this.group.get(key)?.setValidators(control.validators);
        // this.group.get(key)?.setAsyncValidators(control.asyncValidators);
      }
    } else {
      this.group.clearValidators();
      this.group.clearAsyncValidators();
    }

    this.group.updateValueAndValidity({ emitEvent: true });
  }
  setUse(use: FormUse): void {
    this.use = use;
    this.error = undefined;
    if (use === "detail") {
      this.group.disable({ emitEvent: false, onlySelf: true });
      // for (const key in this.controls) this.controls[key].disabled = true;
      this.isReadonly = true;
    }
    if (use === "edit" || use === "create") {
      // for (const key in this.controls) this.controls[key].disabled = false;
      this.group.enable({ emitEvent: false, onlySelf: true });
      for (const key in this.controls) {
        // if (this.controls[key as keyof T].disabled) this.group.get(key)?.disable({ emitEvent: false, onlySelf: true });
      }
      this.isReadonly = false;
    }
    this.setReadonlyToControls(this.isReadonly);
  }

  setReadonlyToControls(readonly: boolean): void {
    for (const key in this.controls) {
      // this.controls[key as keyof T].isReadonly = readonly;
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
    // for (const key in this.controls) {
    //   this.controls[key as keyof T].formControl = this.group.controls[key] as AbstractControl<T[keyof T] | null, T[keyof T] | null>;
    //   this.controls[key as keyof T].submitted = true;
    // }
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
  loaded: boolean;

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
}

export class Form<T extends Entity | EntityParams<T>> implements IForm<T> {
  group: FormGroup<{ [K in keyof T]: AbstractControl<T[K] | null, T[K] | null> }>;
  id = createId();
  error?: BadRequest;
  submitted = false;
  validation = true;
  use: FormUse = "detail";
  isReadonly = false;
  controls: { [K in keyof T]: Control<T[K]> };
  controlOrientation?: ControlOrientation = "inline";
  columns?: Column[];
  loaded = false;

  constructor(controls: { [K in keyof T]: Control<T[K]> }, opts?: {
    orientation?: ControlOrientation;
    columns?: Column[];
  }) {
    this.controls = controls;

    let formControls: { [K in keyof T]: AbstractControl<T[K] | null, T[K] | null> } = {} as any;

    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        const control = controls[key as keyof T];
        formControls[key as keyof T] = new FormControl<T[keyof T] | null>(
          { value: control.value, disabled: control.disabled } as any,
          control.validators,
          control.asyncValidators
        );

        control.formControl = formControls[key as keyof T];
        if (opts) {
          control.orientation = opts.orientation || "block";
        }

      }
    }
    this.group = new FormGroup(formControls);

    if (this.isEntityParamsType(controls) && opts?.columns && "sort" in controls) {
      this.columns = opts.columns;
      const ctrls = controls as { [K in keyof EntityParams<T>]: Control<EntityParams<T>[K]> };
      ctrls["sort"].setOptions([], opts.columns);
      ctrls["sort"].value = opts.columns[0].label as any;
    }

    this.setUse(this.use);
  }

  private isEntityParamsType(controls: { [K in keyof T]: Control<T[K]> }): boolean {
    return "pageNumber" in controls;
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
    if (use === "create") this.reset();
    else this.group.patchValue(value as any);

    if (this.isEntityParamsType(this.controls) && this.columns && "sort" in this.controls) {
      this.group.get("sort")?.setValue(this.columns[0].label as any);
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
      for (const key in this.controls) {
        let control = this.controls[key as keyof T];
        control.validation = validation;
        this.group.get(key)?.setValidators(control.validators);
        this.group.get(key)?.setAsyncValidators(control.asyncValidators);
      }
    } else {
      this.group.clearValidators();
      this.group.clearAsyncValidators();
    }

    this.group.updateValueAndValidity({ emitEvent: true });
  }

  patchWithSample(): void {
    this.group.patchValue({});
  }

  setUse(use: FormUse): void {
    this.use = use;
    this.error = undefined;
    if (use === "detail") {
      this.group.disable({ emitEvent: false, onlySelf: true });
      for (const key in this.controls) this.controls[key].disabled = true;
      this.isReadonly = true;
    }
    if (use === "edit" || use === "create") {
      for (const key in this.controls) this.controls[key].disabled = false;
      this.group.enable({ emitEvent: false, onlySelf: true });
      for (const key in this.controls) {
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
    for (const key in this.controls) {
      this.controls[key as keyof T].formControl = this.group.controls[key] as AbstractControl<T[keyof T] | null, T[keyof T] | null>;
      this.controls[key as keyof T].submitted = true;
    }
  }
}

type ControlType<T> = T extends string | number | Date | SelectOption | Sex
  ? AbstractControl<T | null, T | null>
  : T extends Array<infer U>
  ? FormArray<FormGroup<TypedForm<U>>>
  : T extends object
  ? FormGroup<TypedForm<T>>
  : never;

type ControlTypeExtended<T> = T extends string | number | Date | SelectOption
  ? FormControlExtended<T>
  : T extends Array<infer U extends object>
  ? FormArray<FormGroupExtended<U>>
  : T extends object
  ? FormGroupExtended<T>
  : never;

type ControlTypeBuilder<T> = T extends string | number | Date | SelectOption | Sex
  ? ControlBuilder<T>
  : T extends Array<infer U extends object>
  ? Array<FormBuilder<U>>
  : T extends object
  ? FormBuilder<T>
  : never;

export type TypedForm<T> = {
  [K in keyof T]: ControlType<T[K]>;
};

export type TypedFormBuilder<T> = {
  [K in keyof T]: ControlTypeBuilder<T[K]>;
};

export type TypedFormExtended<T> = {
  [K in keyof T]: ControlTypeExtended<T[K]>;
};

export class PersonForm extends FormBuilder<Person> {}

export type TypedPersonForm = TypedFormBuilder<Person>;

export type TypedPerson = TypedForm<Person>;

export type PersonClassControls = {
  name: AbstractControl<string | null, string | null>;
  age: AbstractControl<number | null, number | null>;
  dateOfBirth: AbstractControl<Date | null, Date | null>;
  photo: FormGroup<{
    url: AbstractControl<string | null, string | null>;
    caption: AbstractControl<string | null, string | null>;
  }>;
  addresses: FormArray<FormGroup<{
    street: AbstractControl<string | null, string | null>;
    city: AbstractControl<string | null, string | null>;
    state: AbstractControl<string | null, string | null>;
    zip: AbstractControl<string | null, string | null>;
  }>>;
};

export class Person {
  name: string = '';
  type = new SelectOption();
  age: number = 0;
  dateOfBirth: Date = new Date();
  photo: Photo = new Photo();
  addresses: Address[] = [];

  constructor(init?: Partial<Person>) {
    Object.assign(this, init);
  }
}

export class Photo {
  url: string = '';
  caption: string = '';

  constructor(init?: Partial<Photo>) {
    Object.assign(this, init);
  }
}

export class Address {
  street: string = '';
  city: string = '';
  state: string = '';
  zip: string = '';

  constructor(init?: Partial<Address>) {
    Object.assign(this, init);
  }
}

export type ControlsOf<T> = {
  [K in keyof T]: T[K] extends (infer U)[]
    ? FormArray<FormGroup<ControlsOf<Partial<U>>>>
    : AbstractControl<T[K] | null, T[K] | null>;
};

export type PersonControls = ControlsOf<Person>;

export class FormArrayBuilder<T extends object> {
  group: FormGroup<{ items: FormArray<FormGroup<ControlsOf<T>>> }>;

  constructor(private createInstance: new (init?: Partial<T>) => T,
    items: T[], size: number = 0) {

    this.group = new FormGroup({
      items: new FormArray<FormGroup<ControlsOf<T>>>([]),
    });

    for (let i = 0; i < size; i++) {
      if (i < items.length) {
        this.add(items[i]);
      } else {
        this.add(new this.createInstance());
      }
    }
  }

  private createFormControls(instance: T): { [K in keyof T]: FormControl<T[K] | null> } {
    const result = {} as { [K in keyof T]: FormControl<T[K] | null> };

    Object.keys(instance || {}).forEach((key) => {
      const typedKey = key as keyof T;
      const value = instance ? instance[typedKey] : null;
      result[typedKey] = new FormControl<T[keyof T] | null>(value as T[keyof T] | null);
    });

    return result;
  }

  add(instance: T) {
    const controls = this.createFormControls(instance);
    // this.group.controls.items.push(new FormGroup<ControlsOf<T>>(controls as ControlsOf<T>));
  }

}


export function createTypedFormGroup<T extends object>(createInstance: new (init?: Partial<T>) => T, instance?: T): FormGroup<TypedForm<T>> {
  const formGroup = {} as { [K in keyof T]: any };

  const model = instance || new createInstance();

  Object.keys(model).forEach((key) => {
    const typedKey = key as keyof T;
    const value = model[typedKey];

    if (Array.isArray(value)) {
      // Create FormArray for arrays, each item can be a FormGroup
      formGroup[typedKey] = new FormArray(
        value.map(item => createTypedFormGroup(item.constructor as new (init?: Partial<T[keyof T]>) => T[keyof T], item)) // Explicitly use item.constructor as a class constructor
      );
    } else if (typeof value === 'object' && value !== null) {
      // Recursively create FormGroup for nested objects
      formGroup[typedKey] = createTypedFormGroup<typeof value>(value.constructor as new (init?: Partial<T[keyof T]>) => any, value);
    } else {
      // Create FormControl for simple fields
      formGroup[typedKey] = new FormControl(value as T[keyof T] | null);
    }
  });

  return new FormGroup(formGroup) as FormGroup<TypedForm<T>>;
}

export function createTypedFormGroupType<T extends object>(createInstance: new (init?: Partial<T>) => T, instance?: T): TypedForm<T> {
  const formGroup = {} as { [K in keyof T]: any };

  const model = instance || new createInstance();

  Object.keys(model).forEach((key) => {
    const typedKey = key as keyof T;
    const value = model[typedKey];

    if (Array.isArray(value)) {
      // Create FormArray for arrays, each item can be a FormGroup
      formGroup[typedKey] = new FormArray(
        value.map(item => createTypedFormGroup(item.constructor as new (init?: Partial<T[keyof T]>) => T[keyof T], item)) // Explicitly use item.constructor as a class constructor
      );
    } else if (typeof value === 'object' && value !== null) {
      // Recursively create FormGroup for nested objects
      formGroup[typedKey] = createTypedFormGroup<typeof value>(value.constructor as new (init?: Partial<T[keyof T]>) => any, value);
    } else {
      // Create FormControl for simple fields
      formGroup[typedKey] = new FormControl(value as T[keyof T] | null);
    }
  });

  return new FormGroup(formGroup).controls as TypedForm<T>;
}

export function createTypedFormGroupExtended<T extends object>(createInstance: new (init?: Partial<T>) => T, instance?: T): TypedFormExtended<T> {
  const formGroup = {} as { [K in keyof T]: any };

  const model = instance || new createInstance();

  Object.keys(model).forEach((key) => {
    const typedKey = key as keyof T;
    const value = model[typedKey];

    if (Array.isArray(value)) {
      formGroup[typedKey] = new FormArray(
        value.map(item => createTypedFormGroup(item.constructor as new (init?: Partial<T[keyof T]>) => T[keyof T], item)) // Explicitly use item.constructor as a class constructor
      );
    } else if (typeof value === 'object' && value !== null) {
      // Recursively create FormGroup for nested objects
      formGroup[typedKey] = new FormGroupExtended(value.constructor as new (init?: Partial<T>) => any, value as any);
    } else {
      // Create FormControl for simple fields
      formGroup[typedKey] = new FormControlExtended(value as any);
    }
  });

  return formGroup as TypedFormExtended<T>;
}

export function createTypedFormBuilder<T extends object>(createInstance: new (init?: Partial<T>) => T, instance?: T): TypedFormBuilder<T> {
  const formBuilder = {} as { [K in keyof T]: any };

  const model = instance || new createInstance();

  Object.keys(model).forEach((key) => {
    const typedKey = key as keyof T;
    const value = model[typedKey];

    if (Array.isArray(value)) {
      // For arrays, create an array of FormBuilder
      formBuilder[typedKey] = value.map((item) => createTypedFormBuilder(item.constructor as new (init?: Partial<T[keyof T]>) => T[keyof T], item));
    } else if (typeof value === 'object' && value !== null) {
      // Recursively create FormBuilder for nested objects
      formBuilder[typedKey] = createTypedFormBuilder<typeof value>(value.constructor as new (init?: Partial<T[keyof T]>) => any, value);
    } else {
      // Create ControlBuilder for simple fields
      formBuilder[typedKey] = {
        formControl: new FormControl(value as T[keyof T] | null),
        // Define default settings for the control
        type: 'text', // Modify this according to the type of input you want
        label: key,
        name: key,
        placeholder: '',
        value: value as T[keyof T] | null,
        options: [],
        disabled: false,
        validators: [],
        asyncValidators: [],
        helperText: '',
        isReadonly: false,
        id: key,
        use: 'edit',
        submitted: false,
        touched: false,
        showLabel: true,
        hidden: false,
        optional: false,
        isNew: false,
        errors: {},
        validation: true,
        isGroupSpan: false,
        showCodeSpan: false,
        setValidation(validation: boolean) {
          this.validation = validation;
          return this;
        },
        setOptions(options: SelectOption[], columns: Column[]) {
          this.options = options;
          return this;
        },
        setValue(value: T[keyof T]) {
          this.formControl.setValue(value);
          return this;
        },
        setValidators(validators: ValidatorFn[]) {
          this.validators = validators;
          this.formControl.setValidators(validators);
          return this;
        },
        setAsyncValidators(asyncValidators: AsyncValidatorFn[]) {
          this.asyncValidators = asyncValidators;
          this.formControl.setAsyncValidators(asyncValidators);
          return this;
        },
        setTypeaheadOptions(options: string[]) {
          this.typeahead = { options };
          return this;
        }
      };
    }
  });

  return formBuilder as TypedFormBuilder<T>;
}

export class FormGroupExtended<T extends object> extends FormGroup {
  id: string = createId();
  error?: BadRequest;
  submitted: boolean = false;
  validation: boolean = true;

  override controls: TypedFormExtended<T>;

  constructor(
    createInstance: new (init?: Partial<T>) => T,
    // controls: TypedForm<T>,
    instance?: T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(
      createTypedFormGroupType<T>(createInstance, instance),
      // controls,
      validatorOrOpts,
      asyncValidator,
    );

    this.controls = createTypedFormGroupExtended<T>(createInstance, instance);
  }

}

export class FormControlExtended<T extends string | number | boolean | Date | SelectOption> extends FormControl<T | null> {
  id: string = createId();
  label: string = '';
  name: string = '';
  type: InputTypes = 'text';

  constructor(
    value: FormControlState<T> | T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | FormControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
    init?: Partial<FormControlExtended<T>>
  ) {
    super(value, validatorOrOpts, asyncValidator);

    Object.assign(this, init);
  }
}
