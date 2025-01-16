import { AbstractControl, AsyncValidatorFn, FormControl, ValidatorFn, Validators } from "@angular/forms";
import { createId } from "@paralleldrive/cuid2";
import { ITypeaheadOptions, TypeaheadOptions } from "./deprecatedControlOptions";
import { SelectOption } from "src/app/_models/base/selectOption";
import { ControlErrors, ControlOrientation, FormUse, InputTypes } from "src/app/_models/forms/formTypes";
import { Column } from "../../base/column";

export interface IControl<TValue> {
  type: InputTypes;
  label: string;
  name: string;
  placeholder: string | null;
  value: TValue | null;
  options: SelectOption[];
  disabled: boolean;
  validators: ValidatorFn[];
  asyncValidators: AsyncValidatorFn[];
  helperText: string | null;
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
  showCodeSpan: boolean;
  useOptionAsValue: boolean;

  get required(): boolean;

  setValidation(validation: boolean): Control<TValue>;

  setOptions(options: SelectOption[], columns: Column[]): Control<TValue>;

  setValue(value: TValue): Control<TValue>;

  setValidators(validators: ValidatorFn[]): Control<TValue>;

  setAsyncValidators(asyncValidators: AsyncValidatorFn[]): Control<TValue>;

  setTypeaheadOptions(options: string[]): Control<TValue>;
}
export class Control<TValue> implements IControl<TValue | null> {
  type: InputTypes;
  label: string;
  name: string;
  placeholder: string | null = null;
  value: TValue | null = null;
  options: SelectOption[] = [];
  disabled = false;
  hidden = false;
  validators: ValidatorFn[] = [];
  asyncValidators: AsyncValidatorFn[] = [];
  helperText: string | null = null;
  isReadonly = false;
  id: string;
  use: FormUse = FormUse.DETAIL;
  submitted = false;
  touched = false;
  formControl: AbstractControl<TValue | null, TValue | null>;
  showLabel = true;
  optional = false;
  isNew = false;
  errors: ControlErrors = {};
  orientation?: ControlOrientation = "block";
  validation = false;
  typeahead: ITypeaheadOptions = new TypeaheadOptions();
  isGroupSpan = false;
  useOptionAsValue = false;
  showCodeSpan = true;

  constructor(
    type: InputTypes,
    label: string,
    name: string,
    opts?: Partial<IControl<TValue>>
  ) {
    this.type = type;
    this.label = label;
    this.name = name;
    this.id = `${name}Control${createId()}`;
    this.formControl = new FormControl<TValue>({
      value: opts?.value || (null as unknown as TValue),
      disabled: opts?.disabled || false
    });

    if (opts !== undefined) {
      if (opts.placeholder !== null && opts.placeholder !== undefined) {
        this.placeholder = opts.placeholder;
      }
      if (opts.helperText !== null && opts.helperText !== undefined) {
        this.helperText = opts.helperText;
      }
    }

    if (opts) {
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
      if (opts.typeahead) {
        this.typeahead = opts.typeahead;
      }
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
      if (isTypeahead) {
        this.typeahead = new TypeaheadOptions({
          ...this.typeahead, options: options.map(option => option.name)
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
