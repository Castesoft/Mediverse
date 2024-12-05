import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { ConsumptionLevel } from "src/app/_models/consumptionLevels/consumptionLevel";
import { consumptionLevelFormInfo } from "src/app/_models/consumptionLevels/consumptionLevelConstants";

export class ConsumptionLevelForm extends FormGroup2<ConsumptionLevel> {
  constructor() {
    super(ConsumptionLevel, new ConsumptionLevel(), consumptionLevelFormInfo);
  }
}
