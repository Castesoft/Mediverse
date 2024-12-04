import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Substance } from "src/app/_models/substances/substance";
import { substanceFormInfo } from "src/app/_models/substances/substanceConstants";

export class SubstanceForm extends FormGroup2<Substance> {
  constructor() {
    super(Substance, new Substance(), substanceFormInfo);
  }
}
