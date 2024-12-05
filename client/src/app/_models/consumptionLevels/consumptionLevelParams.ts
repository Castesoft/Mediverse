import { EntityParams } from "src/app/_models/base/entityParams";
import { ConsumptionLevel } from "src/app/_models/consumptionLevels/consumptionLevel";


export class ConsumptionLevelParams extends EntityParams<ConsumptionLevel> {
  constructor(key: string | null) {
    super(key);
  }
}
