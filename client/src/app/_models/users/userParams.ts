import { EntityParams } from "src/app/_models/base/entityParams";
import { User } from "src/app/_models/users/user";


export class UserParams extends EntityParams<User> {

  constructor(key: string | null) {
    super(key);
  }
}
