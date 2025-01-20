import { createId } from "@paralleldrive/cuid2";
import { RoleParams } from "src/app/_models/roles/roleParams";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { roleFiltersFormInfo } from "src/app/_models/roles/roleConstants";

export class RoleFiltersForm extends FormGroup2<RoleParams> {
  constructor() {
    super(RoleParams as any, new RoleParams(createId()), roleFiltersFormInfo);
  }
}
