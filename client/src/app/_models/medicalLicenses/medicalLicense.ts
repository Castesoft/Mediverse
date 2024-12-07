import { Document } from "src/app/_models/documents/document";


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
