import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { userFiltersFormInfo } from "src/app/_models/users/userConstants";
import { UserParams } from "src/app/_models/users/userParams";

export class UserFiltersForm extends FormGroup2<UserParams> {
  constructor() {
    super(UserParams as any, new UserParams(createId()), userFiltersFormInfo);
  }
}
