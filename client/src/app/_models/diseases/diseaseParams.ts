import { EntityParams } from "src/app/_models/base/entityParams";
import { Disease } from "src/app/_models/diseases/disease";


export class DiseaseParams extends EntityParams<Disease> {
  constructor(key: string | null) {
    super(key);
  }
}
