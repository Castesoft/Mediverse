import { Addresses } from "src/app/_models/addresses/addressTypes";
import { Entity } from "src/app/_models/base/entity";
import { SelectOption } from "src/app/_models/base/selectOption";


export class Address extends Entity {
  street: string | null = null;
  exteriorNumber: string | null = null;
  interiorNumber: string | null = null;
  neighborhood: string | null = null;
  city: string | null = null;
  state: string | null = null;
  country: string | null = null;
  zipcode: string | null = null;
  photoUrl: string | null = null;
  latitude: number | null = null;
  longitude: number | null = null;
  type: Addresses | null = null;

  nursesCount: number | null = null;
  isMain: boolean | null = null;

  select: SelectOption | null = null;

  constructor(init?: Partial<Omit<Address, 'address'>>) {
    super();

    Object.assign(this, init);
  }

  get address(): string {
    return `${this.street} ${this.exteriorNumber} ${this.interiorNumber}, ${this.neighborhood}, ${this.city}, ${this.state}, ${this.country}, ${this.zipcode}`;
  }
}
