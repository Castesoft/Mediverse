import { Entity } from 'src/app/_models/base/entity';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { Document } from "src/app/_models/documents/document";


export class MedicalLicense extends Entity {
  document: Document = new Document();
  isMain: boolean = false;
  licenseNumber: string | null = null;
  specialtyLicense: string | null = null;
  specialtyId: number | null = null;
  specialtyName: string | null = null;
  file: File | null = null;
  specialty: SelectOption | null = null;

  constructor(init?: Partial<MedicalLicense>) {
    super();
    Object.assign(this, init);
  }
}
