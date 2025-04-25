import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { doctorAssociationFiltersFormInfo } from "src/app/_models/doctorAssociations/doctorAssociationConstants";
import { DoctorAssociationParams } from "src/app/_models/doctorAssociations/doctorAssociationParams";

export class DoctorAssociationFiltersForm extends FormGroup2<DoctorAssociationParams> {
  constructor() {
    super(DoctorAssociationParams as any, new DoctorAssociationParams(createId()), doctorAssociationFiltersFormInfo);
  }
}
