import { User } from 'src/app/_models/users/user';

export default class Nurse extends User {
  constructor(init?: Partial<Nurse>) {
    super();
    Object.assign(this, init);
  }

}
