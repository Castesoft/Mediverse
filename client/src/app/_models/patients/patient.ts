import { User } from "src/app/_models/users/user";

export class Patient extends User {
  constructor(init?: Partial<Patient>) {
    super();
    Object.assign(this, init);
  }
}
