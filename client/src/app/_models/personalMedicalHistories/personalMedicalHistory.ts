import { SelectOption } from "src/app/_models/base/selectOption";


export class PersonalMedicalHistory {
  id: number | null = null;
  disease: SelectOption | null = null;
  description: string | null = null;

  constructor(init?: Partial<PersonalMedicalHistory>) {
    Object.assign(this, init);
  }
}
