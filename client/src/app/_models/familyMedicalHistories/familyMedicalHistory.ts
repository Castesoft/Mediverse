import { SelectOption } from "src/app/_models/base/selectOption";


export class FamilyMedicalHistory {
  id: number | null = null;
  disease: SelectOption | null = null;
  relativeType: SelectOption | null = null;
  description: string | null = null;

  constructor(init?: Partial<FamilyMedicalHistory>) {
    Object.assign(this, init);
  }
}
