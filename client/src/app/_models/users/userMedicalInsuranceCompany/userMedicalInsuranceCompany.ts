import { SelectOption } from "src/app/_models/base/selectOption";
import { Document } from "src/app/_models/documents/document";


export class UserMedicalInsuranceCompany {
  id: number | null = null;
  isMain: boolean | null = false;
  policyNumber: string | null = null;
  medicalInsuranceCompany: SelectOption | null = null;
  document: Document = new Document();

  constructor(init?: Partial<UserMedicalInsuranceCompany>) {
    Object.assign(this, init);
  }
}
