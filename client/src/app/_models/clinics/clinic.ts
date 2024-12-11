import { Address } from "src/app/_models/addresses/address";


export default class Clinic extends Address {
  constructor(init?: Partial<Clinic>) {
    super();
    Object.assign(this, init);
  }
}
