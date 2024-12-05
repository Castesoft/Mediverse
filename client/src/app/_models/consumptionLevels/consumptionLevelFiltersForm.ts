import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { consumptionLevelFiltersFormInfo } from "src/app/_models/consumptionLevels/consumptionLevelConstants";
import { ConsumptionLevelParams } from "src/app/_models/consumptionLevels/consumptionLevelParams";

export class ConsumptionLevelFiltersForm extends FormGroup2<ConsumptionLevelParams> {
  constructor() {
    super(ConsumptionLevelParams as any, new ConsumptionLevelParams(createId()), consumptionLevelFiltersFormInfo);
  }
}
