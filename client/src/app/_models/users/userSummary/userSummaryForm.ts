import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { UserSummary } from "src/app/_models/users/userSummary/userSummary";
import { userSummaryFormInfo } from "src/app/_models/users/userSummary/userSummaryConstants";


export class UserSummaryForm extends FormGroup2<UserSummary> {
  constructor() {
    super(UserSummary, new UserSummary(), userSummaryFormInfo);
  }
}
