import { SelectOption } from "src/app/_models/base/selectOption";


export class PersonalDrugHistory {
  id: number | null = null;
  substance: SelectOption | null = null;
  consumptionLevel: SelectOption | null = null;
  startAge: number | null = null;
  endAge: number | null = null;
  isCurrent: boolean | null = false;

  constructor(init?: Partial<PersonalDrugHistory>) {
    Object.assign(this, init);
  }
}
