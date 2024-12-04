import { FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { ControlBuilder } from 'src/app/_models/forms/deprecated/controlBuilder';
import { FormBuilder } from 'src/app/_models/forms/deprecated/formBuilder';
import { Sex } from "../../animals/animalTypes";

export type ControlsOf<T> = {
  [K in keyof T]: T[K] extends (infer U)[]
    ? FormArray<FormGroup<ControlsOf<Partial<U>>>>
    : AbstractControl<T[K] | null, T[K] | null>;
};

export type TypedFormBuilder<T> = {
  [K in keyof T]: ControlTypeBuilder<T[K]>;
};

export type TypedForm<T> = {
  [K in keyof T]: ControlType<T[K]>;
};

export type ControlTypeBuilder<T> = T extends
  | string
  | number
  | Date
  | SelectOption
  | Sex
  ? ControlBuilder<T>
  : T extends Array<infer U extends object>
    ? Array<FormBuilder<U>>
    : T extends object
      ? FormBuilder<T>
      : never;

export type ControlType<T> = T extends
  | string
  | number
  | Date
  | SelectOption
  | Sex
  ? AbstractControl<T | null, T | null>
  : T extends Array<infer U>
    ? FormArray<FormGroup<TypedForm<U>>>
    : T extends object
      ? FormGroup<TypedForm<T>>
      : never;
