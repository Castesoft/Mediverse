import { EntityParams } from "src/app/_models/base/entityParams";
import { Specialty } from "src/app/_models/specialties/specialty";


export class SpecialtyParams extends EntityParams<Specialty> {
  constructor(key: string | null) {
    super(key);
  }
}
