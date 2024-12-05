import { EntityParams } from "src/app/_models/base/entityParams";
import { Prescription } from "src/app/_models/prescriptions/prescription";

export class PrescriptionParams extends EntityParams<Prescription> {
  constructor(key: string | null) {
    super(key);
  }
}
