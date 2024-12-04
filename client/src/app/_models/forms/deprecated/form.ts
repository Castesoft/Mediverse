import { FormGroup, AbstractControl, FormControl } from "@angular/forms";
import { createId } from "@paralleldrive/cuid2";
import { Entity } from "src/app/_models/base/entity";
import { EntityParams } from "src/app/_models/base/entityParams";
import { Control } from "src/app/_models/forms/deprecated/control";
import { ControlOrientation } from "src/app/_models/forms/formTypes";
import { BadRequest } from "../error";
import { Column } from "../../base/column";
import { FormUse } from "../formTypes";


export interface IForm<T extends Record<keyof T, any>> {
  group: FormGroup<{
    [K in keyof T]: AbstractControl<T[K] | null, T[K] | null>;
  }>;
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

  get value(): {
    [K in keyof T]: T[K];
  };

  controls: {
    [K in keyof T]: Control<T[K]>;
  };

  getControl(key: keyof T): Control<T[keyof T]>;

  getControls(keys?: (keyof T)[]): { control: Control<T[keyof T]>; }[];

  setValidation(validation: boolean): void;

  patchWithSample(): void;

  setUse(use: FormUse): void;

  setReadonlyToControls(readonly: boolean): void;

  onCancel(): void;

  reset(): void;

  patch(use: FormUse, value: {
    [K in keyof T]?: T[K];
  }): void;

  setTypeaheadOptions(key: keyof T, options: string[]): this;
}export class Form<T extends Entity | EntityParams<T> | object> implements IForm<T> {
  group: FormGroup<{
    [K in keyof T]: AbstractControl<T[K] | null, T[K] | null>;
  }>;
  id = createId();
  error?: BadRequest;
  submitted = false;
  validation = true;
  use: FormUse = "detail";
  isReadonly = false;
  controls: {
    [K in keyof T]: Control<T[K]>;
  };
  controlOrientation?: ControlOrientation = "inline";
  columns?: Column[];
  loaded = false;

  constructor(controls: {
    [K in keyof T]: Control<T[K]>;
  }, opts?: {
    orientation?: ControlOrientation;
    columns?: Column[];
  }) {
    this.controls = controls;

    let formControls: {
      [K in keyof T]: AbstractControl<T[K] | null, T[K] | null>;
    } = {} as any;

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
      const ctrls = controls as {
        [K in keyof EntityParams<T>]: Control<EntityParams<T>[K]>;
      };
      ctrls["sort"].setOptions([], opts.columns);
      ctrls["sort"].value = opts.columns[0].label as any;
    }

    this.setUse(this.use);
  }

  setTypeaheadOptions(key: keyof T, options: string[]): this {
    this.controls[key].setTypeaheadOptions(options);
    return this;
  }

  private isEntityParamsType(controls: {
    [K in keyof T]: Control<T[K]>;
  }): boolean {
    return "pageNumber" in controls;
  }

  get value(): T {
    const value: {
      [K in keyof T]: T[K];
    } = {} as any;

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

  patch(use: FormUse, value: {
    [K in keyof T]?: T[K];
  }): void {
    if (use === "create") this.reset();
    else this.group.patchValue(value as any);

    if (this.isEntityParamsType(this.controls) && this.columns && "sort" in this.controls) {
      this.group.get("sort")?.setValue(this.columns[0].label as any);
    }
  }

  getControl(key: keyof T): Control<T[keyof T]> {
    return this.controls[key];
  }

  getControls(keys?: (keyof T)[]): { control: Control<T[keyof T]>; }[] {
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

  onSuccess(item: T) {
    this.setUse('detail');
    this.group.patchValue(item as any);
    this.patch('detail', item);
    this.group.markAsPristine();
  }

}

