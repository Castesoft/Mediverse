import { Account } from "src/app/_models/account/account";
import { accountFormInfo } from "src/app/_models/account/accountConstants";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";


export class AccountForm extends FormGroup2<Account> {
  constructor() {
    super(Account, new Account(), accountFormInfo);
  }
}
