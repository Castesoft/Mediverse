import { EntityParams } from 'src/app/_models/base/entityParams';
import { Subscription } from "src/app/_models/subscriptions/subscription";

export class SubscriptionParams extends EntityParams<Subscription> {
  doctorId: number | null = null;

  constructor(key: string | null, init?: Partial<SubscriptionParams>) {
    super(key);
    Object.assign(this, init);
  }
}
