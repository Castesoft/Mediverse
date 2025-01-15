import { EntityParams } from "src/app/_models/base/entityParams";
import { Prescription } from "src/app/_models/prescriptions/prescription";

export class PrescriptionParams extends EntityParams<Prescription> {
  eventId: number | null = null;

  constructor(key: string | null, init?: Partial<PrescriptionParams>) {
    super(key, init);
    Object.assign(this, init);
  }
}
