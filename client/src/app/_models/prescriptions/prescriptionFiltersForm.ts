import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { prescriptionFiltersFormInfo } from "src/app/_models/prescriptions/prescriptionConstants";
import { PrescriptionParams } from "src/app/_models/prescriptions/prescriptionParams";

export class PrescriptionFiltersForm extends FormGroup2<PrescriptionParams> {
  constructor() {
    super(PrescriptionParams as any, new PrescriptionParams(createId()), prescriptionFiltersFormInfo);
  }
}
