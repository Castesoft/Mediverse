import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { colorBlindnessFiltersFormInfo } from "src/app/_models/colorBlindnesses/colorBlindnessConstants";
import { ColorBlindnessParams } from "src/app/_models/colorBlindnesses/colorBlindnessParams";

export class ColorBlindnessFiltersForm extends FormGroup2<ColorBlindnessParams> {
  constructor() {
    super(ColorBlindnessParams as any, new ColorBlindnessParams(createId()), colorBlindnessFiltersFormInfo);
  }
}
