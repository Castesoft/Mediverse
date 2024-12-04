
/**
 * Represents a range with minimum and maximum values.
 *
 * @class Ranges
 * @property {number | null} min - The minimum value of the range. Defaults to null.
 * @property {number | null} max - The maximum value of the range. Defaults to null.
 *
 * @constructor
 * @param {Partial<Ranges>} [init] - An optional object to initialize the range values.
 */
export class Ranges {
  min: number | null = null;
  max: number | null = null;

  constructor(init?: Partial<Ranges>) {
    Object.assign(this, init);
  }
}

/**
 * Checks if the given value is of type `Ranges`.
 *
 * This function verifies that the provided value is an object
 * with `min` and `max` properties, both of which are numbers.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a `Ranges` object, otherwise `false`.
 */
export function isRanges(value: any): value is Ranges {
  return (
    value &&
    typeof value === 'object' &&
    'min' in value &&
    typeof value.min === 'number' &&
    'max' in value &&
    typeof value.max === 'number'
  );
}

