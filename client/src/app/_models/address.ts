import { FormInfo } from "src/app/_forms/form2";
import { Entity } from "src/app/_models/types";

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
  city: { label: 'Ciudad', type: 'text' },
  code: { label: 'Código', type: 'text' },
  codeNumber: { label: 'Número de código', type: 'number' },
  country: { label: 'País', type: 'text' },
  createdAt: { label: 'Creado en', type: 'date' },
  description: { label: 'Descripción', type: 'text' },
  enabled: { label: 'Habilitado', type: 'checkbox' },
  exteriorNumber: { label: 'Número exterior', type: 'text' },
  id: { label: 'ID', type: 'number' },
  interiorNumber: { label: 'Número interior', type: 'text' },
  isMain: { label: 'Es principal', type: 'checkbox' },
  isSelected: { label: 'Está seleccionado', type: 'checkbox' },
  latitude: { label: 'Latitud', type: 'number' },
  longitude: { label: 'Longitud', type: 'number' },
  name: { label: 'Nombre', type: 'text' },
  neighborhood: { label: 'Colonia', type: 'text' },
  nursesCount: { label: 'Número de enfermeras', type: 'number' },
  photoUrl: { label: 'URL de foto', type: 'text' },
  state: { label: 'Estado', type: 'text' },
  street: { label: 'Calle', type: 'text' },
  type: { label: 'Tipo', type: 'select' },
  visible: { label: 'Visible', type: 'checkbox' },
  zipcode: { label: 'Código postal', type: 'text' },
} as FormInfo<Address>;
