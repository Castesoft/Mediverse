import { SelectOption } from "src/app/_models/base/selectOption";


/**
 * Represents a pair of select options.
 */
export class SelectOptionPair {
  first: SelectOption | null = null;
  second: SelectOption | null = null;

  constructor(init?: Partial<SelectOptionPair>) {
    Object.assign(this, init);
  }
}
