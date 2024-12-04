import {
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { createId } from '@paralleldrive/cuid2';
import { TypedForm } from "./controlTypes";
import { TypedFormBuilder } from "./controlTypes";
import { SelectOption } from 'src/app/_models/base/selectOption';
import { ControlOrientation } from 'src/app/_models/forms/formTypes';
import { BadRequest } from "../error";
import { Column } from "../../base/column";
import { FormUse } from "../formTypes";

export class FormBuilder<T extends object> {
  id: string = createId();

  constructor(
    createInstance: new (init?: Partial<T>) => T,
    instance?: T,
    init?: Partial<FormBuilder<T>>,
  ) {
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
    if (use === 'detail') {
      this.group.disable({ emitEvent: false, onlySelf: true });
      // for (const key in this.controls) this.controls[key].disabled = true;
      this.isReadonly = true;
    }
    if (use === 'edit' || use === 'create') {
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
export function createTypedFormGroup<T extends object>(
  createInstance: new (init?: Partial<T>) => T,
  instance?: T,
): FormGroup<TypedForm<T>> {
  const formGroup = {} as {
    [K in keyof T]: any;
  };

  const model = instance || new createInstance();

  Object.keys(model).forEach((key) => {
    const typedKey = key as keyof T;
    const value = model[typedKey];

    if (Array.isArray(value)) {
      // Create FormArray for arrays, each item can be a FormGroup
      formGroup[typedKey] = new FormArray(
        value.map((item) =>
          createTypedFormGroup(
            item.constructor as new (init?: Partial<T[keyof T]>) => T[keyof T],
            item,
          ),
        ), // Explicitly use item.constructor as a class constructor
      );
    } else if (typeof value === 'object' && value !== null) {
      // Recursively create FormGroup for nested objects
      formGroup[typedKey] = createTypedFormGroup<typeof value>(
        value.constructor as new (init?: Partial<T[keyof T]>) => any,
        value,
      );
    } else {
      // Create FormControl for simple fields
      formGroup[typedKey] = new FormControl(value as T[keyof T] | null);
    }
  });

  return new FormGroup(formGroup) as FormGroup<TypedForm<T>>;
}
export function createTypedFormBuilder<T extends object>(
  createInstance: new (init?: Partial<T>) => T,
  instance?: T,
): TypedFormBuilder<T> {
  const formBuilder = {} as {
    [K in keyof T]: any;
  };

  const model = instance || new createInstance();

  Object.keys(model).forEach((key) => {
    const typedKey = key as keyof T;
    const value = model[typedKey];

    if (Array.isArray(value)) {
      // For arrays, create an array of FormBuilder
      formBuilder[typedKey] = value.map((item) =>
        createTypedFormBuilder(
          item.constructor as new (init?: Partial<T[keyof T]>) => T[keyof T],
          item,
        ),
      );
    } else if (typeof value === 'object' && value !== null) {
      // Recursively create FormBuilder for nested objects
      formBuilder[typedKey] = createTypedFormBuilder<typeof value>(
        value.constructor as new (init?: Partial<T[keyof T]>) => any,
        value,
      );
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
        },
      };
    }
  });

  return formBuilder as TypedFormBuilder<T>;
}
