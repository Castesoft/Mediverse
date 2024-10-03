import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, FormControl, FormControlOptions, FormControlState, FormGroup, ValidatorFn, Validators, ɵTypedOrUntyped } from "@angular/forms";
import { createId } from "@paralleldrive/cuid2";
import { ControlErrors, ControlOrientation, InputTypes, isSelectOption, SelectOption } from "src/app/_forms/form";
import { BadRequest, ColumnOptions, DateRange, FormUse, Units } from "src/app/_models/types";
import { Address, Person, Photo } from "src/app/_utils/person";

type ControlInfo<T extends string | number | boolean | Date | DateRange | SelectOption | null> = Partial<{
  label: string;
  name: string;
  type: InputTypes;
  placeholder?: string;
  selectOptions: SelectOption[];
  hidden: boolean;
  helperText?: string;
  isReadonly: boolean;
  use: FormUse;
  submitted: boolean;
  showLabel: boolean;
  optional: boolean;
  isDisabled: boolean;
  isNew: boolean;
  orientation?: ControlOrientation;
  validation: boolean;
  isGroupSpan: boolean;
  useOptionAsValue: boolean;
  showCodeSpan: boolean;
  validationErrors: ControlErrors;
  columnOptions: ColumnOptions;
  unit: Units;
  slideAlternateStyle: boolean;
  validators: ValidatorFn[];
}>;

type ControlInfoMap<T> = T extends string
  ? ControlInfo<string>
  : T extends boolean
  ? ControlInfo<boolean>
  : T extends number
  ? ControlInfo<number>
  : T extends boolean
  ? ControlInfo<boolean>
  : T extends Date
  ? ControlInfo<Date>
  : T extends DateRange
  ? ControlInfo<DateRange>
  : T extends SelectOption
  ? ControlInfo<SelectOption>
  : T extends Array<any>
  ? { [K in keyof T[0]]: ControlInfoMap<T[0][K]> }
  : T extends object
  ? { [K in keyof T]: ControlInfoMap<T[K]> }
  : never;

export type FormInfo<T extends object> = {
  [K in keyof T]: ControlInfoMap<T[K]>;
};

export type Columns<T extends object> = {
  [K in keyof T]: SelectOption;
};

export const ramiro = new Person({
  name: 'Ramiro',
  age: 24,
  dateOfBirth: new Date(2000, 5, 2),
  type: new SelectOption({ code: 'admin', name: 'Administrador', id: 1, }),
  photo: new Photo({
    caption: 'Foto de Ramiro',
    url: 'https://www.google.com',
  }),
  addresses: [
    new Address({
      city: 'San Pedro Garza García',
      street: 'La Gloria',
      state: 'Nuevo León',
      zip: '66247',
    }),
    new Address({
      city: 'Monterrey',
      street: 'Anillo Periférico',
      state: 'Nuevo León',
      zip: '64637',
    }),
  ]
});

type TypedControl<T> = T extends string | number | Date | DateRange | SelectOption
  ? AbstractControl<T | null, T | null>
  : T extends Array<infer U>
  ? FormArray<FormGroup<TypedForm<U>>>
  : T extends object
  ? FormGroup<TypedForm<T>>
  : never
;

type TypedFormControl<T> = T extends string | number | Date | DateRange | SelectOption
  ? FormControl2<T | null>
  : T extends Array<infer U extends object>
  ? FormArray<FormGroup2<U>>
  : T extends object
  ? FormGroup2<T>
  : never
;

type TypedForm<T> = {
  [K in keyof T]: TypedControl<T[K]>;
};

type TypedFormGroup<T> = {
  [K in keyof T]: TypedFormControl<T[K]>;
};

function createTypedFormGroup<T extends object>(createInstance: new (init?: Partial<T>) => T, instance?: T): FormGroup<TypedForm<T>> {
  const formGroup = {} as { [K in keyof T]: any };

  const model = instance || new createInstance();

  Object.keys(model).forEach((key) => {
    const typedKey = key as keyof T;
    const value = model[typedKey];

    if (Array.isArray(value)) {
      formGroup[typedKey] = new FormArray(
        value.map(item => createTypedFormGroup(item.constructor as new (init?: Partial<T[keyof T]>) => T[keyof T], item))
      );
    } else if (value instanceof SelectOption || value instanceof Date || typeof value === 'string' || typeof value === 'number') {
      formGroup[typedKey] = new FormControl2(value as any | null);
    } else if (typeof value === 'object' && value !== null) {
      formGroup[typedKey] = createTypedFormGroup<typeof value>(value.constructor as new (init?: Partial<T[keyof T]>) => any, value);
    } else {
      formGroup[typedKey] = new FormControl2(null);
    }
  });

  return new FormGroup(formGroup) as FormGroup<TypedForm<T>>;
}

function createTypedFormGroup2<T extends object>(
  createInstance: new (init?: Partial<T>) => T,
  instance?: T,
  info?: FormInfo<T>,
  init?: Partial<FormGroup2<T>>
): FormGroup2<T> {
  const formGroup = {} as { [K in keyof T]: any };

  const model = instance || new createInstance();

  Object.keys(model).forEach((key) => {
    const typedKey = key as keyof T;
    const value = model[typedKey];

    // Create FormControls or FormGroups based on the type of the value
    if (Array.isArray(value)) {
      formGroup[typedKey] = new FormArray(
        value.map(item => createTypedFormGroup2(
          item.constructor as new (init?: Partial<T[keyof T]>) => T[keyof T],
          item,
          (info ? info[typedKey] as FormInfo<any> : undefined),
          init
        ))
      );
    } else if (
      isSelectOption(value) ||
      value instanceof DateRange ||
      value instanceof Date ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null
    ) {
      const controlInfo = info && info[typedKey] as ControlInfo<any>;
      const validators = controlInfo?.validators || [];
      formGroup[typedKey] = new FormControl2(value as any | null, validators);

      // Apply FormInfo settings if provided
      if (controlInfo) {
        const control = formGroup[typedKey] as FormControl2<any>;
        Object.assign(control, controlInfo);

        // Apply the global orientation if set in init
        if (init?.orientation) {
          control.orientation = init.orientation;
        }
        if (init?.use === 'detail') {
          control.use = 'detail';
          control.disable();
        }
        if (controlInfo.isDisabled === true) {
          control.disable();
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      formGroup[typedKey] = createTypedFormGroup2(
        value.constructor as new (init?: Partial<T[keyof T]>) => any,
        value,
        (info ? info[typedKey] as FormInfo<any> : undefined),
        init
      );
    } else {
      formGroup[typedKey] = new FormControl2(null);
    }
  });

  return new FormGroup(formGroup) as FormGroup2<T>;
}

export class FormGroup2<T extends object> extends FormGroup<TypedFormGroup<T>> {
  id: string = createId();
  error?: BadRequest;
  submitted: boolean = false;
  validation: boolean = true;
  orientation?: ControlOrientation = "inline";
  submittable: boolean = true;
  use: FormUse = "detail";
  show: boolean = false;

  override controls!: TypedFormGroup<T>;

  constructor(
    createInstance: new (init?: Partial<T>) => T,
    instance: T,
    info: FormInfo<T>,
    init?: Partial<FormGroup2<T>>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(
      createTypedFormGroup2<T>(createInstance, instance, info, init).controls as any,
      validatorOrOpts,
      asyncValidator,
    );
  }

  setUse(use: FormUse): this {
    this.use = use;
    this.updateControlsUse(use);
    return this;
  }

  private updateControlsUse(use: FormUse): void {
    Object.values(this.controls).forEach(control => {
      if (control instanceof FormGroup2) {
        control.setUse(use);
      } else if (control instanceof FormArray) {
        control.controls.forEach(ctrl => {
          if (ctrl instanceof FormGroup2) {
            ctrl.setUse(use);
          } else if (ctrl instanceof FormControl2) {
            ctrl.setUse(use);
          }
        });
      } else if (control instanceof FormControl2) {
        control.setUse(use);
      }
    });
  }

}

export class FormControl2<T extends string | number | boolean | Date | DateRange | SelectOption | null> extends FormControl<T | null> {
  id: string = createId();
  label: string = '';
  name: string = '';
  type: InputTypes = 'text';

  placeholder?: string;
  selectOptions: SelectOption[] = [];
  hidden = false;
  helperText?: string;
  isReadonly = false;
  use: FormUse = "detail";
  submitted = false;
  showLabel = true;
  optional = false;
  isNew = false;
  orientation?: ControlOrientation = "block";
  validation = false;
  isGroupSpan = false;
  useOptionAsValue = false;
  showCodeSpan = true;
  validationErrors: ControlErrors = {};
  isDisabled = false;
  slideAlternateStyle = false;

  constructor(
    value: FormControlState<T> | T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | FormControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
    init?: Partial<FormControl2<T>>
  ) {
    super(value, validatorOrOpts, asyncValidator);

    Object.assign(this, init);


  }

  setValidation(validation: boolean): this {
    this.validation = validation;
    return this;
  }

  get required(): boolean {
    return this.hasValidator(Validators.required);
  }

  setUse(use: FormUse): this {
    this.use = use;
    if (use === 'detail') {
      this.disable({ emitEvent: false });
    } else {
      this.enable({ emitEvent: false });
    }
    return this;
  }
}
