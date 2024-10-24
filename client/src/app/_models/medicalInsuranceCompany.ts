import { FormInfo } from "src/app/_forms/form2";

export class MedicalInsuranceCompany {
  id: number | null = null;
  name: string | null = null;
  photoUrl: string | null = null;

  constructor(init?: Partial<MedicalInsuranceCompany>) {
    Object.assign(this, init);
  }
}

export const medicalInsuranceCompanyInfo: FormInfo<MedicalInsuranceCompany> = {
  id: { label: 'ID', type: 'number' },
  name: { label: 'Nombre', type: 'text' },
  photoUrl: { label: 'URL de la foto', type: 'text' },
} as FormInfo<MedicalInsuranceCompany>;
