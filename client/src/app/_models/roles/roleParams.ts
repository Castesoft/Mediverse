import { EntityParams } from "src/app/_models/base/entityParams";
import { Role } from "src/app/_models/roles/role";

export class RoleParams extends EntityParams<Role> {
  constructor(key: string | null, init?: Partial<RoleParams>) {
    super(key);
    Object.assign(this, init);
  }
}
