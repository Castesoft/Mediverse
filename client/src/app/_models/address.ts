import { FormInfo } from "src/app/_forms/form2";
import { baseInfo, Entity } from "src/app/_models/types";

export type Addresses = 'Account' | 'Clinic';

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

  constructor(init?: Partial<Omit<Address, 'address'>>) {
    super();

    Object.assign(this, init);
  }

  get address(): string {
    return `${this.street} ${this.exteriorNumber} ${this.interiorNumber}, ${this.neighborhood}, ${this.city}, ${this.state}, ${this.country}, ${this.zipcode}`;
  }
}

export const addressInfo: FormInfo<Address> = {
  // ...baseInfo,
  // city: { label: 'Ciudad', type: 'text' },
  // country: { label: 'País', type: 'text' },
  // exteriorNumber: { label: 'Número exterior', type: 'text' },
  // interiorNumber: { label: 'Número interior', type: 'text' },
  // isMain: { label: 'Es principal', type: 'checkbox' },
  // latitude: { label: 'Latitud', type: 'number' },
  // longitude: { label: 'Longitud', type: 'number' },
  // neighborhood: { label: 'Colonia', type: 'text' },
  // nursesCount: { label: 'Número de enfermeras', type: 'number' },
  // photoUrl: { label: 'URL de foto', type: 'text' },
  // state: { label: 'Estado', type: 'text' },
  // street: { label: 'Calle', type: 'text' },
  // type: { label: 'Tipo', type: 'select' },
  // zipcode: { label: 'Código postal', type: 'text' },
} as FormInfo<Address>;
