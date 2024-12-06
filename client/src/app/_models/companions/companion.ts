import { SelectOption } from "src/app/_models/base/selectOption";


export class Companion {
  id: number | null = null;
  name: string | null = null;
  sex: SelectOption | null = null;
  age: number | null = null;
  phoneNumber: string | null = null;
  homeNumber: string | null = null;
  email: string | null = null;
  address: string | null = null;
  relativeType: SelectOption | null = null;
  occupation: SelectOption | null = null;

  constructor(init?: Partial<Companion>) {
    Object.assign(this, init);
  }
}
