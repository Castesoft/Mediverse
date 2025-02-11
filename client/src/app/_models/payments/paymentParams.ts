import { Payment } from "src/app/_models/payments/payment";
import { EntityParams } from "src/app/_models/base/entityParams";

export class PaymentParams extends EntityParams<Payment> {
  doctorId: number | null = null;
  eventId: number | null = null;

  constructor(key: string | null, init?: Partial<PaymentParams>) {
    super(key);
    Object.assign(this, init);
  }
}
