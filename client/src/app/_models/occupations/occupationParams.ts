import { EntityParams } from "src/app/_models/base/entityParams";
import { Occupation } from "src/app/_models/occupations/occupation";


export class OccupationParams extends EntityParams<Occupation> {
  constructor(key: string | null) {
    super(key);
  }
}
