import {
  AsyncValidatorFn,
  FormControl,
  FormControlOptions,
  FormControlState,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { createId } from "@paralleldrive/cuid2";
import { ControlErrors, ControlOrientation, FormUse, InputTypes, Style } from "./formTypes";
import { SelectOptionOptions, TextareaOptions, TypeaheadOptions } from "./controlOptions";
import { Ranges } from "src/app/_models/base/ranges";
import { SelectOption } from "src/app/_models/base/selectOption";
import { DateRange } from "../base/dateRange";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import MaterialOptions from 'src/app/_models/forms/materialOptions';
import DateOptions from 'src/app/_models/forms/dateOptions';
import MultiselectOptions from "src/app/_models/base/multiselectOptions";


/**
 * A specialized form control class that extends Angular's `FormControl` to provide additional properties and methods
 * for handling various input types and configurations.
 *
 * @template T - The type of the form control's value. It can be one of the following types: `string`, `number`, `boolean`,
 * `Date`, `SelectOption`, `File`, `Ranges`, `SelectOption[]`, `DateRange`, or `null`.
 *
 * @extends FormControl
 *
 * @property {string} id - A unique identifier for the form control.
 * @property {string} label - The label text for the form control.
 * @property {string} name - The name attribute for the form control.
 * @property {InputTypes} type - The type of input for the form control. Default is 'text'.
 * @property {string} [placeholder] - The placeholder text for the form control.
 * @property {SelectOption[]} selectOptions - An array of select options for the form control.
 * @property {boolean} hidden - A flag indicating whether the form control is hidden. Default is `false`.
 * @property {string} [helperText] - Helper text for the form control.
 * @property {boolean} isReadonly - A flag indicating whether the form control is read-only. Default is `false`.
 * @property {FormUse} use - The usage mode of the form control. Default is 'detail'.
 * @property {boolean} submitted - A flag indicating whether the form control has been submitted. Default is `false`.
 * @property {boolean} showLabel - A flag indicating whether the label should be shown. Default is `true`.
 * @property {boolean} optional - A flag indicating whether the form control is optional. Default is `false`.
 * @property {boolean} isNew - A flag indicating whether the form control is new. Default is `false`.
 * @property {ControlOrientation} [orientation] - The orientation of the form control. Default is 'block'.
 * @property {boolean} validation - A flag indicating whether validation is enabled. Default is `false`.
 * @property {boolean} showCodeSpan - A flag indicating whether to show the code span. Default is `true`.
 * @property {ControlErrors} validationErrors - An object containing validation errors for the form control.
 * @property {string} inputGroupPrepend - Text to prepend to the input group.
 * @property {string} inputGroupAppend - Text to append to the input group.
 * @property {boolean} isDisabled - A flag indicating whether the form control is disabled. Default is `false`.
 * @property {TypeaheadOptions} typeahead - Options for typeahead functionality.
 * @property {TextareaOptions} textareaOptions - Options for textarea functionality.
 * @property {SelectOptionOptions} selectOptionOptions - Options for select option functionality.
 * @property {string | null} title - The title of the form control.
 * @property {Style} style - The style of the form control. Default is 'bootstrap'.
 * @property {Ranges} ranges - The ranges for the form control.
 *
 * @constructor
 * @param {FormControlState<T> | T} value - The initial value or state of the form control.
 * @param {ValidatorFn | ValidatorFn[] | FormControlOptions | null} [validatorOrOpts] - The synchronous validators or options for the form control.
 * @param {AsyncValidatorFn | AsyncValidatorFn[] | null} [asyncValidator] - The asynchronous validators for the form control.
 * @param {Partial<FormControl2<T>>} [init] - An optional partial initialization object to set additional properties.
 */
export class FormControl2<T extends string | number | boolean | Date | SelectOption | File | File[] | Ranges | SelectOption[] | DateRange | null> extends FormControl<T | null> {
  id: string = createId();
  label: string = '';
  name: string = '';
  type: InputTypes = 'text';

  placeholder: string | null = null;
  helperText: string | null = null;
  selectOptions: SelectOption[] = [];
  multiselectOptions: MultiselectOptions = new MultiselectOptions();
  hidden: boolean = false;
  solid: boolean = false;
  hint: string | null = null;
  isReadonly: boolean = false;
  use: FormUse = FormUse.DETAIL;
  submitted: boolean = false;
  showLabel: boolean = true;
  optional: boolean = false;
  isNew: boolean = false;
  orientation?: ControlOrientation = "block";
  validation: boolean = false;
  showCodeSpan: boolean = true;
  validationErrors: ControlErrors = {};
  inputGroupPrepend: string = '';
  inputGroupAppend: string = '';
  isDisabled: boolean = false;
  typeahead: TypeaheadOptions = new TypeaheadOptions();
  textareaOptions: TextareaOptions = new TextareaOptions();
  selectOptionOptions: SelectOptionOptions = new SelectOptionOptions();
  title: string | null = null;
  style: Style = 'bootstrap';
  ranges: Ranges = new Ranges();
  appearance: MatFormFieldAppearance = 'outline';
  prefix: string | null = null;
  suffix: string | null = null;
  materialOptions: MaterialOptions = new MaterialOptions();
  dateOptions: DateOptions = new DateOptions();
  rows: number | null = null; // For TextArea

  constructor(
    value: FormControlState<T> | T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | FormControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
    init?: Partial<FormControl2<T>>
  ) {
    super(value, validatorOrOpts, asyncValidator);

    Object.assign(this, init);
  }

  /**
   * Sets the validation state for the form control.
   *
   * @param validation - A boolean indicating whether validation is enabled or not.
   * @returns The current instance of the form control.
   */
  setValidation(validation: boolean): this {
    this.validation = validation;
    return this;
  }

  /**
   * Checks if the form control has the 'required' validator.
   *
   * @returns {boolean} - Returns `true` if the form control has the 'required' validator, otherwise `false`.
   */
  get required(): boolean {
    return this.hasValidator(Validators.required);
  }

  /**
   * Sets the usage mode of the form control and enables or disables it accordingly.
   *
   * @param use - The usage mode to set. It can be 'detail' or any other mode.
   * @returns The current instance of the form control.
   */
  setUse(use: FormUse): this {
    this.use = use;
    if (use === 'detail') {
      this.disable({ emitEvent: false });
    } else {
      this.enable({ emitEvent: false });
    }
    return this;
  }

  /**
   * Sets the select options for the form control.
   *
   * @param options - An array of `SelectOption` objects to be set as the select options.
   * @returns The current instance of the form control.
   */
  setSelectOptions(options: SelectOption[]): this {
    this.selectOptions = options;
    return this;
  }

  /**
   * Determines if the form control is optional based on the provided conditions.
   *
   * @param hide - A boolean flag indicating whether to hide the form control. If true, the form control is considered not optional.
   * @returns A boolean value indicating whether the form control is optional.
   */
  isOptional(hide: boolean = false): boolean {
    if (hide) return false;

    if (this.validator !== null) {
      const validatorResponse = this.validator({} as FormControl);
      return !(validatorResponse && validatorResponse["required"]);
    }

    return true;
  }

  /**
   * Retrieves an array of error messages based on the current validation errors.
   *
   * This method checks the `errors` property of the form control and maps each error
   * to a corresponding error message. If a custom validation error message is defined
   * in `validationErrors`, it will use that message instead.
   *
   * Supported validation errors and their default messages:
   * - `required`: "Este campo es requerido."
   * - `email`: "Debe ser un email válido."
   * - `minlength`: "Debe tener al menos {requiredLength} caracteres."
   * - `maxlength`: "Deber tener un máximo de {requiredLength} caracteres."
   * - `pattern`: "El formato es inválido."
   * - `min`: "Debe ser mayor o igual a {min}."
   * - `max`: "Deber ser menor o igual a {max}."
   * - `nameExists`: "El nombre ya existe."
   *
   * @returns {string[]} An array of error messages.
   */
  get errorMessages(): string[] {
    let errorMessages: string[] = [];
    const errors = this.errors;
    if (errors !== null) {
      for (const error of Object.keys(errors)) {
        if (!this.validationErrors[error]) {
          switch (error) {
            case 'required': {
              errorMessages.push('Este campo es requerido.');
              break;
            }
            case 'email': {
              errorMessages.push('Debe ser un email válido.');
              break;
            }
            case 'minlength': {
              errorMessages.push(`Debe tener al menos ${errors['minlength'].requiredLength} caracteres.`);
              break;
            }
            case 'maxlength': {
              errorMessages.push(`Deber tener un máximo de ${errors['maxlength'].requiredLength} caracteres.`);
              break;
            }
            case 'pattern': {
              errorMessages.push('El formato es inválido.');
              break;
            }
            case 'min': {
              errorMessages.push(`Debe ser mayor o igual a ${errors['min'].min}.`);
              break;
            }
            case 'max': {
              errorMessages.push(`Deber ser menor o igual a ${errors['max'].max}.`);
              break;
            }
            case 'nameExists': {
              errorMessages.push('El nombre ya existe.');
              break;
            }
          }
        } else {
          errorMessages.push(this.validationErrors[error]);
        }
      }
    }

    return errorMessages;
  }

}
