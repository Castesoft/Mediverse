import { Photo } from "src/app/_models/forms/example/_models/photo";


/**
 * Represents an address with street, city, state, and zip code.
 *
 * @property {string | null} street - The street address.
 * @property {string | null} city - The city of the address.
 * @property {string | null} state - The state of the address.
 * @property {string | null} zip - The zip code of the address.
 * @property {Photo} photo - A photo associated with the address.
 *
 * @constructor
 * @param {Partial<Address>} [init] - Optional initialization object to assign properties.
 */
export class Address {
  street: string | null = null;
  city: string | null = null;
  state: string | null = null;
  zip: string | null = null;

  photo: Photo = new Photo();

  constructor(init?: Partial<Address>) {
    Object.assign(this, init);
  }
}
