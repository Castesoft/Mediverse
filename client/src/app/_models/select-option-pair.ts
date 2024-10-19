import { SelectOption } from "src/app/_forms/form";

export class SelectOptionPair {
  first: SelectOption | null = null;
  second: SelectOption | null = null;

  constructor(init?: Partial<SelectOptionPair>) {
    Object.assign(this, init);
  }
}
