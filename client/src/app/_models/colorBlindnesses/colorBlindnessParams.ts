import { EntityParams } from "src/app/_models/base/entityParams";
import { ColorBlindness } from "src/app/_models/colorBlindnesses/colorBlindness";


export class ColorBlindnessParams extends EntityParams<ColorBlindness> {
  constructor(key: string | null) {
    super(key);
  }
}
