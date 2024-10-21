import { FormInfo } from "src/app/_forms/form2";
import { Document, documentInfo } from "src/app/_models/document";


export class MedicalLicense {
  document: Document = new Document();
  isMain: boolean = false;
  licenseNumber: string | null = null;
  specialtyLicense: string | null = null;
  specialtyId: number | null = null;
  specialtyName: string | null = null;

  constructor(init?: Partial<MedicalLicense>) {
    Object.assign(this, init);
  }
}

export const medicalLicenseInfo: FormInfo<MedicalLicense> = {
  document: documentInfo,
  isMain: { label: 'Es principal', type: 'checkbox' },
  licenseNumber: { label: 'Número de licencia', type: 'text' },
  specialtyLicense: { label: 'Especialidad de licencia', type: 'text' },
  specialtyId: { label: 'ID de especialidad', type: 'number' },
  specialtyName: { label: 'Nombre de especialidad', type: 'text' },
} as FormInfo<MedicalLicense>;
