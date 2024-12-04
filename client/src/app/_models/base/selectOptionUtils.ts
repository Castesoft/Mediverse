import { SelectOption } from "src/app/_models/base/selectOption";
import { ControlInfo } from "src/app/_models/forms/formTypes";


/**
 * Checks if a given value is a SelectOption.
 *
 * A SelectOption is an object that has the following properties:
 * - `id`: a number
 * - `code`: a string
 * - `name`: a string
 * - `enabled`: a boolean or null
 * - `visible`: a boolean or null
 *
 * @param value - The value to check.
 * @returns True if the value is a SelectOption, false otherwise.
 */
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
    (typeof value.enabled === 'boolean' || value.enabled === null) &&
    'visible' in value &&
    (typeof value.visible === 'boolean' || value.visible === null)
  );
}

/**
 * Checks if the given value is an array of SelectOption objects.
 *
 * @param value - The value to check.
 * @param controlInfo - The control information that provides context about the expected type.
 * @returns `true` if the value is an array of SelectOption objects, otherwise `false`.
 *
 * The function performs the following checks:
 * - If the value is not an array, it returns `false`.
 * - If the value is an empty array, it checks the controlInfo to determine if it should be treated as a SelectOption array.
 * - If the value is a non-empty array, it checks if every element in the array is a SelectOption.
 */
export function isSelectOptionArray(value: any, controlInfo: ControlInfo<any>): boolean {
  if (!Array.isArray(value)) {
    return false;
  }
  if (value.length === 0) {
    // For empty arrays, check if controlInfo indicates it's a SelectOption[]
    return controlInfo && (controlInfo.type === 'multiselect' ||
      controlInfo.type === 'select' ||
      controlInfo.type === 'buttonToggleMultiple'
    );
  }
  return value.every(isSelectOption);
}

/**
 * Generates an array of `SelectOption` instances representing years within a specified range.
 *
 * @param startYear - The starting year of the range (inclusive). This value will be rounded to the nearest integer.
 * @param endYear - The ending year of the range (inclusive). This value will be rounded to the nearest integer. If not provided, the current year will be used.
 * @returns An array of `SelectOption` instances, each representing a year within the specified range, ordered in descending order.
 * @throws An error if the `startYear` is greater than or equal to the `endYear`.
 */
export function generateYearOptions(startYear: number, endYear?: number): SelectOption[] {
  // Round the years to the nearest integer
  startYear = Math.round(startYear);
  if (endYear !== undefined) {
    endYear = Math.round(endYear);
  } else {
    // Get the current year if endYear is undefined
    const today = new Date();
    endYear = today.getFullYear();
  }

  // Ensure the first number is lower than the second
  if (startYear >= endYear) {
    throw new Error('The first number must be lower than the second.');
  }

  // Generate the array of SelectOption instances
  const yearOptions: SelectOption[] = [];
  for (let year = startYear; year <= endYear; year++) {
    const yearStr = year.toString();
    yearOptions.push(new SelectOption({ code: yearStr, name: yearStr }));
  }

  // order the years in descending order
  yearOptions.sort((a, b) => (a.code < b.code ? 1 : -1));

  return yearOptions;
}

