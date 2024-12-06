import { SelectOption } from "src/app/_models/base/selectOption";


export class FamilyMember {
  id: number | null = null;
  relativeType: SelectOption | null = null;
  name: string | null = null;
  age: number | null = null;

  constructor(init?: Partial<FamilyMember>) {
    Object.assign(this, init);
  }
}
