import { EntityParams } from "src/app/_models/base/entityParams";
import { User } from "src/app/_models/users/user";
import { SelectOption } from "src/app/_models/base/selectOption";


export class UserParams extends EntityParams<User> {
  roles: SelectOption[] = [];

  constructor(key: string | null) {
    super(key);
  }
}
