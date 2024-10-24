import { FormInfo } from "src/app/_forms/form2";
import { Document, documentInfo } from "src/app/_models/document";

export class UserMedicalInsuranceCompany {
  id: number | null = null;
  name: string | null = null;
  isMain: boolean | null = false;
  policyNumber: string | null = null;
  photoUrl: string | null = null;
  document: Document = new Document();

  constructor(init?: Partial<UserMedicalInsuranceCompany>) {
    Object.assign(this, init);
  }
}

export const userMedicalInsuranceCompanyInfo: FormInfo<UserMedicalInsuranceCompany> = {
  document: documentInfo,
  id: { label: 'Id', type: 'number' },
  isMain: { label: 'Es principal', type: 'checkbox' },
  name: { label: 'Nombre', type: 'text' },
  photoUrl: { label: 'Foto', type: 'text' },
  policyNumber: { label: 'Número de póliza', type: 'text' },
} as FormInfo<UserMedicalInsuranceCompany>;
