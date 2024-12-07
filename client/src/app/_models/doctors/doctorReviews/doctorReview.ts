import { Account } from "src/app/_models/account/account";


export class DoctorReview {
  rating: number | null = null;
  comment: string | null = null;
  createdAt: Date | null = null;
  account: Account = new Account();

  constructor(init?: Partial<DoctorReview>) {
    Object.assign(this, init);
  }
}
