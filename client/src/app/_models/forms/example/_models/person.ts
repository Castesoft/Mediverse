import { Ranges } from "src/app/_models/base/ranges";
import { SelectOption } from "src/app/_models/base/selectOption";
import { Address } from "src/app/_models/forms/example/_models/address";
import { Photo } from "src/app/_models/forms/example/_models/photo";

/**
 * Represents a person with various attributes.
 *
 * @property {number | null} id - The unique identifier of the person.
 * @property {boolean | null} isActive - Indicates if the person is active.
 * @property {string | null} name - The name of the person.
 * @property {SelectOption | null} type - The type of person.
 * @property {SelectOption[]} permissions - The permissions assigned to the person.
 * @property {Ranges | null} yearRange - The range of years associated with the person.
 * @property {SelectOption[]} actives - The active status options for the person.
 * @property {number | null} age - The age of the person.
 * @property {Date | null} dateOfBirth - The date of birth of the person.
 * @property {Photo} photo - The photo of the person.
 * @property {Address[]} addresses - The addresses associated with the person.
 */
export class Person {
  id: number | null = null;
  isActive: boolean | null = null;
  name: string | null = null;
  type: SelectOption | null = null;
  permissions: SelectOption[] = [];
  yearRange: Ranges | null = null;
  actives: SelectOption[] = [];
  age: number | null = null;
  dateOfBirth: Date | null = null;
  photo: Photo = new Photo();
  addresses: Address[] = [];
  email: string | null = null;
  description: string | null = null;

  password: string | null = null;
  passwordConfirm: string | null = null;

  constructor(init?: Partial<Person>) {
    Object.assign(this, init);
  }
}
