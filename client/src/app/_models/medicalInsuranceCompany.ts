import { FormInfo } from "src/app/_forms/form2";
import { Entity } from "src/app/_models/types";

export class MedicalInsuranceCompany extends Entity {
  photoUrl: string | null = null;

  constructor(init?: Partial<MedicalInsuranceCompany>) {
    super();
    
    Object.assign(this, init);
  }
}

export const medicalInsuranceCompanyInfo: FormInfo<MedicalInsuranceCompany> = {
  id: { label: 'ID', type: 'number' },
  name: { label: 'Nombre', type: 'text' },
  photoUrl: { label: 'URL de la foto', type: 'text' },
} as FormInfo<MedicalInsuranceCompany>;
