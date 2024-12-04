
/**
 * Represents the options for a specific entity.
 *
 * @property {string | null} sex - The sex of the entity.
 * @property {string | null} race - The race of the entity.
 * @property {number | null} price - The price associated with the entity.
 * @property {number | null} dosage - The dosage information for the entity.
 * @property {number | null} age - The age of the entity.
 * @property {string | null} photoUrl - The URL of the entity's photo.
 * @property {string | null} unit - The unit of measurement for the entity.
 * @property {string | null} description - A description of the entity.
 * @property {string | null} color - The color associated with the entity.
 * @property {boolean | null} isMain - Indicates if the entity is the main one.
 *
 * @constructor
 * @param {Partial<Options>} [init] - An optional object to initialize the options.
 */
export class Options {
  sex: string | null = null;
  race: string | null = null;
  price: number | null = null;
  dosage: number | null = null;
  age: number | null = null;
  photoUrl: string | null = null;
  unit: string | null = null;
  description: string | null = null;
  color: string | null = null;
  isMain: boolean | null = null;

  constructor(init?: Partial<Options>) {
    Object.assign(this, init);
  }
}
