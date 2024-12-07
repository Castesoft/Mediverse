import { DoctorClinic } from "src/app/_models/doctors/doctorClinics/doctorClinic";
import { FormInfo } from "src/app/_models/forms/formTypes";


export const doctorClinicFormInfo: FormInfo<DoctorClinic> = {
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
