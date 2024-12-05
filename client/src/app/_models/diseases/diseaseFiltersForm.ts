import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { diseaseFiltersFormInfo } from "src/app/_models/diseases/diseaseConstants";
import { DiseaseParams } from "src/app/_models/diseases/diseaseParams";

export class DiseaseFiltersForm extends FormGroup2<DiseaseParams> {
  constructor() {
    super(DiseaseParams as any, new DiseaseParams(createId()), diseaseFiltersFormInfo);
  }
}
