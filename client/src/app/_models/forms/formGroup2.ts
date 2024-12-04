import { FormArray, FormGroup, ValidatorFn, AbstractControlOptions, AsyncValidatorFn } from "@angular/forms";
import { DateRange } from "@angular/material/datepicker";
import { createId } from "@paralleldrive/cuid2";
import { EntityParams } from "src/app/_models/base/entityParams";
import { isRanges, Ranges } from "src/app/_models/base/ranges";
import { SelectOption } from "src/app/_models/base/selectOption";
import { isSelectOptionArray, isSelectOption } from "src/app/_models/base/selectOptionUtils";
import { BadRequest } from "src/app/_models/forms/error";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormInfo, ControlInfo, TypedFormGroup, ControlOrientation, FormUse, InputTypes, Style } from "src/app/_models/forms/formTypes";
import { isFile } from "src/app/_models/forms/formUtils";

export function createTypedFormGroup2<T extends object>(
  createInstance: new (init?: Partial<T>) => T,
  instance?: T,
  info?: FormInfo<T>,
  init?: Partial<FormGroup2<T>>
): FormGroup2<T> {
  const formGroup = {} as {
    [K in keyof T]: any;
  };

  const model = instance || new createInstance();

  Object.keys(model).forEach((key) => {
    const typedKey = key as keyof T;
    const value = model[typedKey];
    const controlInfo = info ? info[typedKey] as ControlInfo<any> : null;

    // Create FormControls or FormGroups based on the type of the value
    if (Array.isArray(value)) {
      if (isSelectOptionArray(value, controlInfo as any)) {
        // Handle SelectOption[] as FormControl2
        formGroup[typedKey] = new FormControl2(value as any | null);

        // Apply FormInfo settings if provided
        if (info && info[typedKey]) {
          const control = formGroup[typedKey] as FormControl2<any>;
          const controlInfo = info[typedKey] as ControlInfo<any>;
          Object.assign(control, controlInfo); // Assign settings from FormInfo


          // Apply the global orientation if set in init
          if (init?.orientation) {
            control.orientation = init.orientation;
          }

          if (controlInfo.validators) {
            control.setValidators(controlInfo.validators);
          }

          if (controlInfo.asyncValidators) {
            control.setAsyncValidators(controlInfo.asyncValidators);
          }

          if (init?.use === 'detail') {
            control.use = 'detail';
            control.disable();
          }
          if (controlInfo.isDisabled === true) {
            control.disable();
          }
        }
      } else {
        formGroup[typedKey] = new FormArray(
          value.map(item => createTypedFormGroup2(
            item.constructor as new (init?: Partial<T[keyof T]>) => T[keyof T],
            item,
            (info ? info[typedKey] as FormInfo<any> : undefined),
            init
          ))
        );
      }
    } else if (isSelectOption(value) ||
      isFile(value) ||
      isRanges(value) ||
      value instanceof File ||
      value instanceof DateRange ||
      value instanceof Ranges ||
      value instanceof Date ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null) {
      // console.log('FORM CONTROL 2 value', typedKey, value);
      formGroup[typedKey] = new FormControl2(value as any | null);

      // Apply FormInfo settings if provided
      if (info && info[typedKey]) {
        const control = formGroup[typedKey] as FormControl2<any>;
        const controlInfo = info[typedKey] as ControlInfo<any>;
        Object.assign(control, controlInfo); // Assign settings from FormInfo


        // Apply the global orientation if set in init
        if (init?.orientation) {
          control.orientation = init.orientation;
        }

        if (controlInfo.validators) {
          control.setValidators(controlInfo.validators);
        }

        if (controlInfo.asyncValidators) {
          control.setAsyncValidators(controlInfo.asyncValidators);
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
  error: BadRequest | null = null;
  submitted: boolean = false;
  validation: boolean = true;
  orientation?: ControlOrientation = "inline";
  use: FormUse = "detail";
  show = false;
  label: string | null = null;
  showLabel = true;
  isNew = false;
  optional = false;
  required = false;
  isReadonly = false;
  hint: string | null = null;
  name: string | null = null;
  hidden: boolean = false;
  type?: InputTypes;
  loading = false;
  selectOptions: SelectOption[] = [];
  style: Style = 'bootstrap';
  private copy: T | null = null;

  declare controls: TypedFormGroup<T>;

  constructor(
    createInstance: new (init?: Partial<T>) => T,
    instance: T,
    info: FormInfo<T>,
    init?: Partial<FormGroup2<T>>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(
      createTypedFormGroup2<T>(createInstance, instance, info, init).controls as any,
      validatorOrOpts,
      asyncValidator
    );
  }

  setUse(use: FormUse): this {
    this.use = use;
    this.updateControlsUse(use);
    if (use === 'detail') {
      this.disable();
    }
    return this;
  }

  setValidation(validation: boolean): this {
    this.validation = validation;
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

  onSuccess(item: T) {
    this.patchValue(item as any);
    this.updateValueAndValidity();
    this.error = null;
    this.markAsPristine();
  }

  get submittable(): boolean {
    if (this.validation === false) return true;

    if (
      this.validation === true &&
      this.valid
    )
    return true;

    return false;
  }

  setSubmitted() {
    this.submitted = true;
    this.markAllAsTouched();
  }

  hideAllLabels() {
    Object.values(this.controls).forEach(control => {
      if (control instanceof FormControl2) {
        control.showLabel = false;
      } else if (control instanceof FormGroup2) {
        control.hideAllLabels();
      } else if (control instanceof FormArray) {
        control.controls.forEach(ctrl => {
          if (ctrl instanceof FormGroup2) {
            ctrl.hideAllLabels();
          } else if (ctrl instanceof FormControl2) {
            ctrl.showLabel = false;
          }
        });
      }
    });
  }

  removeError(): this {
    this.error = null;
    return this;
  }

  setForm(value: T): this {
    if (this.copy === null) {
      this.copy = value;
    }

    this.patchValue(value);
    return this;
  }

  resetForm() {
    if (this.copy !== null) {
      this.patchValue(this.copy);
    } else {
      this.reset();
    }
    this.copy = null;
    this.updateValueAndValidity();
  }

  get params(): EntityParams<T> {
    return new EntityParams<T>(createId(), {...this.value});
  }

}
