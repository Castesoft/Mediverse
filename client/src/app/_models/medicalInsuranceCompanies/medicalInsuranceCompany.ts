import { Entity } from "src/app/_models/base/entity";

export class MedicalInsuranceCompany extends Entity {
  constructor(init?: Partial<MedicalInsuranceCompany>) {
    super();

    Object.assign(this, init);
  }
}
