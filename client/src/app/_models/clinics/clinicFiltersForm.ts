import { createId } from "@paralleldrive/cuid2";
import { clinicFiltersFormInfo } from "src/app/_models/clinics/clinicConstants";
import { ClinicParams } from "src/app/_models/clinics/clinicParams";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";

export class ClinicFiltersForm extends FormGroup2<ClinicParams> {
  constructor() {
    super(ClinicParams as any, new ClinicParams(createId()), clinicFiltersFormInfo);
  }
}
