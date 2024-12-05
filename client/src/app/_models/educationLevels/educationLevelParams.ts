import { EntityParams } from "src/app/_models/base/entityParams";
import { EducationLevel } from "src/app/_models/educationLevels/educationLevel";


export class EducationLevelParams extends EntityParams<EducationLevel> {
  constructor(key: string | null) {
    super(key);
  }
}
