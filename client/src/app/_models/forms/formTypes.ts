import {
  ValidatorFn,
  AsyncValidatorFn,
  AbstractControl,
  FormArray,
  FormGroup,
} from '@angular/forms';
import { Ranges } from 'src/app/_models/base/ranges';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import MaterialOptions from 'src/app/_models/forms/materialOptions';
import DateOptions from 'src/app/_models/forms/dateOptions';
import { DateRange } from 'src/app/_models/base/dateRange';
import { ColumnOptions } from 'src/app/_models/forms/options/columnOptions';
import { Units } from 'src/app/_models/base/types';
import { SelectOptionOptions, TextareaOptions, TypeaheadOptions } from 'src/app/_models/forms/controlOptions';
import { FormControl2 } from 'src/app/_models/forms/formControl2';
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';

/**
 * Represents the information for a control in a form.
 *
 * @template T - The type of the control value, which can be one of the following:
 * - `string`
 * - `number`
 * - `boolean`
 * - `Date`
 * - `SelectOption`
 * - `Ranges`
 * - `SelectOption[]`
 * - `File`
 * - `DateRange`
 * - `null`
 *
 * @property {string} [label] - The label of the control.
 * @property {string} [name] - The name of the control.
 * @property {InputTypes} [type] - The type of the control.
 * @property {string} [placeholder] - The placeholder text for the control.
 * @property {SelectOption[]} [selectOptions] - The options for a select control.
 * @property {boolean} [hidden] - Whether the control is hidden.
 * @property {string} [helperText] - The helper text for the control.
 * @property {boolean} [isReadonly] - Whether the control is read-only.
 * @property {FormUse} [use] - The use case of the form.
 * @property {boolean} [submitted] - Whether the form has been submitted.
 * @property {boolean} [showLabel] - Whether to show the label.
 * @property {boolean} [optional] - Whether the control is optional.
 * @property {boolean} [isDisabled] - Whether the control is disabled.
 * @property {boolean} [isNew] - Whether the control is new.
 * @property {ControlOrientation} [orientation] - The orientation of the control.
 * @property {boolean} [validation] - Whether the control has validation.
 * @property {boolean} [isGroupSpan] - Whether the control spans a group.
 * @property {boolean} [useOptionAsValue] - Whether to use the option as the value.
 * @property {boolean} [showCodeSpan] - Whether to show the code span.
 * @property {ControlErrors} [validationErrors] - The validation errors for the control.
 * @property {ColumnOptions} [columnOptions] - The column options for the control.
 * @property {string} [inputGroupPrepend] - The text to prepend to the input group.
 * @property {string} [inputGroupAppend] - The text to append to the input group.
 * @property {string} [title] - The title of the control.
 * @property {Units} [unit] - The unit of the control.
 * @property {TypeaheadOptions} [typeahead] - The typeahead options for the control.
 * @property {ValidatorFn[]} [validators] - The synchronous validators for the control.
 * @property {AsyncValidatorFn[]} [asyncValidators] - The asynchronous validators for the control.
 * @property {TextareaOptions} [textareaOptions] - The options for a textarea control.
 * @property {SelectOptionOptions} [selectOptionOptions] - The options for a select option control.
 * @property {Style} [style] - The style of the control.
 * @property {Ranges} [ranges] - The ranges for the control.
 */
export type ControlInfo<
  T extends
    | string
    | number
    | boolean
    | Date
    | SelectOption
    | Ranges
    | SelectOption[]
    | File
    | DateRange
    | null,
> = Partial<{
  label: string;
  name: string;
  type: InputTypes;
  placeholder: string | null;
  selectOptions: SelectOption[];
  hidden: boolean;
  hint: string | null;
  isReadonly: boolean;
  prefix: string | null;
  suffix: string | null;
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
  inputGroupPrepend: string;
  inputGroupAppend: string;
  title: string;
  unit: Units;
  typeahead: TypeaheadOptions;
  validators: ValidatorFn[];
  appearance: MatFormFieldAppearance;
  asyncValidators: AsyncValidatorFn[];
  textareaOptions: TextareaOptions;
  selectOptionOptions: SelectOptionOptions;
  style: Style;
  ranges: Ranges;
  materialOptions: MaterialOptions;
  dateOptions: DateOptions;
}>;


/**
 * Maps a type `T` to a corresponding `ControlInfo` type based on the type of `T`.
 *
 * - If `T` is a `string`, it maps to `ControlInfo<string>`.
 * - If `T` is a `boolean`, it maps to `ControlInfo<boolean>`.
 * - If `T` is a `File`, it maps to `ControlInfo<File>`.
 * - If `T` is a `number`, it maps to `ControlInfo<number>`.
 * - If `T` is a `Date`, it maps to `ControlInfo<Date>`.
 * - If `T` is a `DateRange`, it maps to `ControlInfo<DateRange>`.
 * - If `T` is a `Ranges`, it maps to `ControlInfo<Ranges>`.
 * - If `T` is a `SelectOption`, it maps to `ControlInfo<SelectOption>`.
 * - If `T` is an array of `SelectOption`, it maps to `ControlInfo<SelectOption>`.
 * - If `T` is an array of any other type, it maps each element of the array to its corresponding `ControlInfo` type.
 * - If `T` is an object, it maps each property of the object to its corresponding `ControlInfo` type.
 * - Otherwise, it maps to `never`.
 *
 * @template T - The type to be mapped to a `ControlInfo` type.
 */
export type ControlInfoMap<T> = T extends string
  ? ControlInfo<string>
  : T extends boolean
    ? ControlInfo<boolean>
    : T extends File
      ? ControlInfo<File>
      : T extends number
        ? ControlInfo<number>
        : T extends boolean
          ? ControlInfo<boolean>
          : T extends Date
            ? ControlInfo<Date>
            : T extends DateRange
              ? ControlInfo<DateRange>
              : T extends Ranges
                ? ControlInfo<Ranges>
                : T extends SelectOption
                  ? ControlInfo<SelectOption>
                  : T extends Array<SelectOption>
                    ? ControlInfo<SelectOption>
                    : T extends Array<any>
                      ? {
                          [K in keyof T[0]]: ControlInfoMap<T[0][K]>;
                        }
                      : T extends object
                        ? {
                            [K in keyof T]: ControlInfoMap<T[K]>;
                          }
                        : never;


/**
 * Represents a typed form control based on the provided type `T`.
 *
 * - If `T` is a primitive type (string, number, boolean, Date) or a specific type (SelectOption, DateRange, Ranges),
 *   it returns an `AbstractControl` that can hold a value of type `T` or `null`.
 * - If `T` is an array, it returns a `FormArray` containing `FormGroup` elements of the inferred type `U`.
 * - If `T` is an object, it returns a `FormGroup` with controls defined by the `TypedForm` of `T`.
 * - Otherwise, it returns `never`.
 *
 * @template T - The type of the form control.
 */
export type TypedControl<T> = T extends
  | string
  | number
  | boolean
  | Date
  | SelectOption
  | SelectOption[]
  | DateRange
  | Ranges
  ? AbstractControl<T | null, T | null>
  : T extends Array<infer U>
    ? FormArray<FormGroup<TypedForm<U>>>
    : T extends object
      ? FormGroup<TypedForm<T>>
      : never;


/**
 * A type that maps a given type `T` to a specific form control type.
 *
 * - If `T` is a primitive type (`string`, `number`, `boolean`, `Date`, `SelectOption`, `File`, `DateRange`, `Ranges`, or `SelectOption[]`),
 *   it maps to `FormControl2<T | null>`.
 * - If `T` is an array of objects, it maps to `FormArray<FormGroup2<U>>` where `U` is the type of the array elements.
 * - If `T` is an object, it maps to `FormGroup2<T>`.
 * - Otherwise, it maps to `never`.
 *
 * @template T - The type to be mapped to a form control type.
 */
export type TypedFormControl<T> =
  T extends string ? FormControl2<string | null> :
  T extends number ? FormControl2<number | null> :
  T extends boolean ? FormControl2<boolean | null> :
  T extends Date ? FormControl2<Date | null> :
  T extends SelectOption ? FormControl2<SelectOption | null> :
  T extends File ? FormControl2<File | null> :
  T extends DateRange ? FormControl2<DateRange | null> :
  T extends Ranges ? FormControl2<Ranges | null> :
  T extends SelectOption[] ? FormControl2<SelectOption[] | null> :
  T extends Array<infer U extends object>
    ? FormArray<FormGroup2<U>>
    : T extends object
      ? FormGroup2<T>
      : never;

/**
 * Represents a form where each field is a `TypedControl` corresponding to the type of the field in the given model `T`.
 *
 * @template T - The type of the model that defines the structure of the form.
 */
export type TypedForm<T> = {
  [K in keyof T]: TypedControl<T[K]>;
};

/**
 * Represents a form group where each control is strongly typed based on the provided generic type `T`.
 *
 * @template T - The type that defines the structure of the form group.
 *
 * @property {TypedFormControl<T[K]>} [K in keyof T] - A form control that is strongly typed based on the type of the corresponding property in `T`.
 */
export type TypedFormGroup<T> = {
  [K in keyof T]: TypedFormControl<T[K]>;
};

/**
 * Represents a mapping of form controls for a given form model.
 *
 * @template T - The type of the form model.
 * @property {ControlInfoMap<T[K]>} [K in keyof T] - A mapping of each property in the form model to its corresponding control information.
 */
export type FormInfo<T extends object> = {
  [K in keyof T]: ControlInfoMap<T[K]>;
};


/**
 * Represents the style options available for forms.
 *
 * @property {'material'} material - Material design style.
 * @property {'bootstrap'} bootstrap - Bootstrap design style.
*/
export type Style = 'material' | 'bootstrap';


/**
 * Represents the various types of input elements that can be used in forms.
 *
 * The available input types include:
 * - 'text': A standard text input field.
 * - 'file': An input field for file uploads.
 * - 'buttonToggleMultiple': A toggle button for multiple selections.
 * - 'textMat': A material design text input field.
 * - 'bull': A custom input type (specific to the application).
 * - 'sliderRange': A range slider input.
 * - 'donor': A custom input type (specific to the application).
 * - 'textarea': A multi-line text input field.
 * - 'boolean': A boolean input, typically a checkbox.
 * - 'checkbox': A standard checkbox input.
 * - 'slideToggle': A slide toggle input.
 * - 'multiselect': A multi-select dropdown input.
 * - 'dateRange': An input for selecting a range of dates.
 * - 'searchDate': A date input with search functionality.
 * - 'chips': An input for selecting multiple items, displayed as chips.
 * - 'selectMat': A material design select dropdown.
 * - 'select': A standard select dropdown.
 * - 'selectPair': A custom select input for paired values.
 * - 'numberMat': A material design number input field.
 * - 'number': A standard number input field.
 * - 'email': An input field for email addresses.
 * - 'password': An input field for passwords.
 * - 'date': An input field for selecting dates.
 * - 'time': An input field for selecting times.
 * - 'datetime-local': An input field for selecting date and time.
 * - 'month': An input field for selecting months.
 * - 'week': An input field for selecting weeks.
 * - 'url': An input field for URLs.
 * - 'tel': An input field for telephone numbers.
 * - 'search': An input field for search queries.
 * - 'hidden': A hidden input field.
 * - 'typeahead': An input field with typeahead (autocomplete) functionality.
 * - 'select2': A custom select input with enhanced features.
 * - 'color': An input field for selecting colors.
 * - 'radioChips': A radio button input displayed as chips.
 * - 'radio': A standard radio button input.
 */
export type InputTypes =
  | 'text'
  | 'file'
  | 'files'
  | 'file-image'
  | 'buttonToggleMultiple'
  | 'bull'
  | 'sliderRange'
  | 'donor'
  | 'textarea'
  | 'boolean'
  | 'checkbox'
  | 'slideToggle'
  | 'multiselect'
  | 'dateRange'
  | 'searchDate'
  | 'chips'
  | 'select'
  | 'selectPair'
  | 'number'
  | 'email'
  | 'password'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'
  | 'url'
  | 'tel'
  | 'search'
  | 'hidden'
  | 'typeahead'
  | 'color'
  | 'radioChips'
  | 'radio';


/**
 * Represents a collection of control errors where the key is the error type
 * and the value is the corresponding error message.
 */
export type ControlErrors = { [key: string]: string };


/**
 * Represents the number of rows a control can span in a form layout.
 *
 * @property {1} 1 - Control spans 1 row.
 * @property {2} 2 - Control spans 2 rows.
 * @property {3} 3 - Control spans 3 rows.
 * @property {4} 4 - Control spans 4 rows.
 * @property {5} 5 - Control spans 5 rows.
 * @property {6} 6 - Control spans 6 rows.
 * @property {'responsive'} 'responsive' - Control spans a responsive number of rows based on the layout.
 */
export type ControlRows = 1 | 2 | 3 | 4 | 5 | 6 | 'responsive';


/**
 * Represents the orientation of a control in a form.
 *
 * - `inline`: The control is displayed inline with other elements.
 * - `block`: The control is displayed as a block element, taking up the full width available.
 */
export type ControlOrientation = 'inline' | 'block';

/**
 * Represents the different use cases for a form.
 *
 * - `create`: Used when creating a new form.
 * - `edit`: Used when editing an existing form.
 * - `detail`: Used when viewing the details of a form.
 * - `filter`: Used when filtering forms.
 */
export enum FormUse {
  CREATE = "create",
  EDIT = "edit",
  DETAIL = "detail",
  FILTER = "filter"
}

/**
 * Represents the possible error types that can occur in the application.
 *
 * - "BadRequest": Indicates that the request made by the client was invalid.
 * - "ValidationError": Indicates that there was an error validating the client's input.
 */
export type Errors = "BadRequest" | "ValidationError";

