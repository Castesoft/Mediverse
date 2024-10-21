import { FormInfo } from "src/app/_forms/form2";

export class DoctorClinic {
  id: number | null = null;
  isMain: boolean = false;
  street: string | null = null;
  neighborhood: string | null = null;
  exteriorNumber: string | null = null;
  interiorNumber: string | null = null;
  city: string | null = null;
  state: string | null = null;
  country: string | null = null;
  zipcode: string | null = null;
  latitude: number | null = null;
  longitude: number | null = null;
  logoUrl: string | null = null;

  constructor(init?: Partial<DoctorClinic>) {
    Object.assign(this, init);
  }
}

export const doctorClinicInfo: FormInfo<DoctorClinic> = {
  city: { label: 'Ciudad', type: 'text' },
  country: { label: 'País', type: 'text' },
  exteriorNumber: { label: 'Número exterior', type: 'text' },
  id: { label: 'ID', type: 'number' },
  interiorNumber: { label: 'Número interior', type: 'text' },
  isMain: { label: 'Es principal', type: 'checkbox' },
  latitude: { label: 'Latitud', type: 'number' },
  logoUrl: { label: 'URL de logo', type: 'text' },
  longitude: { label: 'Longitud', type: 'number' },
  neighborhood: { label: 'Colonia', type: 'text' },
  state: { label: 'Estado', type: 'text' },
  street: { label: 'Calle', type: 'text' },
  zipcode: { label: 'Código postal', type: 'text' },
} as FormInfo<DoctorClinic>;
