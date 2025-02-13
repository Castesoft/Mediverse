import { EntityParams } from "src/app/_models/base/entityParams";
import { User } from "src/app/_models/users/user";


export class NurseParams extends EntityParams<User> {

  clinicId: number | null = null;

  constructor(key: string | null, init?: Partial<NurseParams>) {
    super(key, init);
    Object.assign(this, init);
  }
}
