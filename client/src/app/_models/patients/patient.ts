import { User } from "src/app/_models/users/user";

export default class Patient extends User {
  // eventsCount: number | null = null;
  prescriptionsCount: number | null = null;
  ordersCount: number | null = null;

  constructor(init?: Partial<Patient>) {
    super();
    Object.assign(this, init);
  }
}
