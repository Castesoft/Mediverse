import { HttpParams } from '@angular/common/http';
import { isRanges, Ranges } from 'src/app/_models/base/ranges';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { isSelectOption } from 'src/app/_models/base/selectOptionUtils';

/**
 * A utility type that determines whether a given type `T` should be included based on specific criteria.
 *
 * This type evaluates to `true` if `T` is one of the following types:
 * - `number`
 * - `string`
 * - `boolean`
 * - `Date`
 * - `Ranges`
 * - `SelectOption`
 * - `SelectOption[]`
 *
 * Otherwise, it evaluates to `false`.
 *
 * @template T - The type to be evaluated.
 */
export type ShouldIncludeKey<T> =
  NonNullable<T> extends number | string | boolean | Date
    ? true
    : NonNullable<T> extends Ranges
      ? true
      : NonNullable<T> extends SelectOption
        ? true
        : NonNullable<T> extends SelectOption[]
          ? true
          : false;

/**
 * Transforms the properties of a given type `T` based on specific conditions.
 *
 * - If the property type should be included (as determined by `ShouldIncludeKey`), it is retained.
 * - If the property type is `SelectOption`, `SelectOption[]`, or `Ranges`, it is transformed to `string | null`.
 * - If the property type is `Date`, it is transformed to `string | null`.
 * - Otherwise, the property type remains unchanged.
 *
 * @template T - The type whose properties are to be transformed.
 */
export type TransformProperties<T> = {
  [K in keyof T as ShouldIncludeKey<T[K]> extends true
    ? K
    : never]: NonNullable<T[K]> extends SelectOption | SelectOption[] | Ranges
    ? string | null
    : NonNullable<T[K]> extends Date
      ? string | null
      : T[K];
};

/**
 * Transforms the properties of an object based on certain criteria.
 *
 * @template T - The type of the input object.
 * @param {T} obj - The object to be transformed.
 * @returns {TransformProperties<T>} - The transformed object with properties that meet the criteria.
 */
export function transform<T>(obj: T): TransformProperties<T> {
  const result = {} as TransformProperties<T>;

  const includedKeys = getIncludedKeys(obj) as Array<
    keyof TransformProperties<T>
  >;

  includedKeys.forEach((key) => {
    const value = obj[key as keyof T];
    const transformedValue = transformValue(value);
    if (
      transformedValue !== undefined &&
      transformedValue !== null &&
      transformedValue !== ''
    ) {
      (result as any)[key] = transformedValue;
    }
  });

  return result;
}

/**
 * Transforms an object of key-value pairs into an instance of `HttpParams`.
 *
 * @param params - An object containing key-value pairs to be transformed.
 *                 The values can be of any type, but they will be converted to strings.
 *
 * @returns An instance of `HttpParams` containing the transformed key-value pairs.
 */
export function transformToHttpParams(params: {
  [key: string]: any;
}): HttpParams {
  let httpParams = new HttpParams();

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];

      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.append(key, value.toString());
      }
    }
  }

  return httpParams;
}


/**
 * Determines whether a given value should be included based on its type.
 *
 * This function returns `true` if the value is `null` or `undefined`, or if it is of type
 * `number`, `string`, `boolean`, `Date`, or if it matches the criteria defined by the
 * `isRanges` or `isSelectOption` functions. Additionally, it returns `true` if the value
 * is an array where every element matches the `isSelectOption` criteria.
 *
 * @param value - The value to be checked.
 * @returns `true` if the value should be included, otherwise `false`.
 */
export function shouldIncludeKey(value: any): boolean {
  if (value === null || value === undefined) return true;

  if (
    typeof value === 'number' ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    value instanceof Date ||
    isRanges(value) ||
    isSelectOption(value) ||
    (Array.isArray(value) && value.every(isSelectOption))
  ) {
    return true;
  }

  return false;
}


/**
 * Retrieves the keys of an object whose values satisfy the `shouldIncludeKey` condition.
 *
 * @template T - The type of the object.
 * @param {T} obj - The object from which to retrieve the keys.
 * @returns {string[]} An array of keys whose corresponding values satisfy the `shouldIncludeKey` condition.
 */
export function getIncludedKeys<T>(obj: T): string[] {
  const keys: string[] = [];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key as keyof T];
      if (shouldIncludeKey(value)) {
        keys.push(key);
      }
    }
  }

  return keys;
}


/**
 * Transforms a given value into a specific format based on its type.
 *
 * @param value - The value to be transformed. It can be of any type.
 * @returns The transformed value which can be a string, boolean, number, or null.
 *          - If the value is an empty string, null, or undefined, it returns null.
 *          - If the value is a number, string, or boolean, it returns the value as is.
 *          - If the value is a Date, it returns the ISO string representation of the date.
 *          - If the value is a Ranges object, it returns a string in the format "min,max".
 *          - If the value is a SelectOption object, it returns the id as a string if the id is not 0, otherwise it returns the code.
 *          - If the value is an array of SelectOption objects, it returns a comma-separated string of ids or codes.
 *          - For other types, it returns null.
 */
export function transformValue(value: any): string | boolean | number | null {
  if (value === '' || value === null || value === undefined) {
    return null;
  } else if (
    typeof value === 'number' ||
    typeof value === 'string' ||
    typeof value === 'boolean'
  ) {
    return value;
  } else if (value instanceof Date) {
    return value.toISOString();
  } else if (isRanges(value)) {
    const min = value.min !== null && value.min !== undefined ? value.min : '';
    const max = value.max !== null && value.max !== undefined ? value.max : '';
    return `${min},${max}`;
  } else if (isSelectOption(value)) {
    if (value.id !== 0) {
      return String(value.id);
    } else {
      return value.code;
    }
  } else if (Array.isArray(value) && value.every(isSelectOption)) {
    const idsOrCodes = value.map((v) => {
      if (v.id !== 0) {
        return String(v.id);
      } else {
        return v.code;
      }
    });
    return idsOrCodes.join(',');
  }

  return null;
}
