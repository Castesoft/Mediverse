import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { ColorBlindness } from "src/app/_models/colorBlindnesses/colorBlindness";
import { colorBlindnessFormInfo } from "src/app/_models/colorBlindnesses/colorBlindnessConstants";

export class ColorBlindnessForm extends FormGroup2<ColorBlindness> {
  constructor() {
    super(ColorBlindness, new ColorBlindness(), colorBlindnessFormInfo);
  }
}
