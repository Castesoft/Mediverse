import { AbstractControl, FormControl, ValidatorFn, AsyncValidatorFn, Validators } from "@angular/forms";
import { createId } from "@paralleldrive/cuid2";
import { ITypeaheadOptions } from "./deprecatedControlOptions";
import { SelectOption } from "src/app/_models/base/selectOption";
import { InputTypes, ControlErrors, ControlOrientation } from "src/app/_models/forms/formTypes";
import { Column } from "../../base/column";
import { FormUse } from "../formTypes";


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
  typeahead?: ITypeaheadOptions;
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
