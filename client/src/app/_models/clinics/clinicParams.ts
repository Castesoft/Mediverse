import { EntityParams } from "src/app/_models/base/entityParams";
import Clinic from "src/app/_models/clinics/clinic";


export default class ClinicParams extends EntityParams<Clinic> {
  doctorId: number | null = null;

  constructor(key: string | null, init?: Partial<ClinicParams>) {
    super(key);
    Object.assign(this, init);
  }
}
