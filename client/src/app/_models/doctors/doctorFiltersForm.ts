import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { doctorFiltersFormInfo } from "src/app/_models/doctors/doctorConstants";
import { DoctorParams } from "src/app/_models/doctors/doctorParams";


export class DoctorFiltersForm extends FormGroup2<DoctorParams> {
  constructor() {
    super(DoctorParams as any, new DoctorParams(createId()), doctorFiltersFormInfo);
  }
}
