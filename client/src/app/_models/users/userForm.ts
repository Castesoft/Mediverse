import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { userInfo } from "./userConstants";
import { User } from "src/app/_models/users/user";


export class UserForm extends FormGroup2<User> {
  constructor() {
    super(User, new User(), userInfo);
  }
}
