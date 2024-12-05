import { EntityParams } from "src/app/_models/base/entityParams";
import { Clinic } from "src/app/_models/clinics/clinic";


export class ClinicParams extends EntityParams<Clinic> {
  constructor(key: string | null) {
    super(key);
  }
}
