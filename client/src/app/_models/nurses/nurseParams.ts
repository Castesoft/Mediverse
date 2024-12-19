import { EntityParams } from "src/app/_models/base/entityParams";
import { User } from "src/app/_models/users/user";


export class NurseParams extends EntityParams<User> {

  constructor(key: string | null) {
    super(key);
  }
}
