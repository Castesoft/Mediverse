import { User } from "../users/user";


export class Doctor extends User {
  specialty: string | null = null;
  accessGranted: Date | null = null;

  constructor(init?: Partial<Doctor>) {
    super();
    Object.assign(this, init);
  }
}
