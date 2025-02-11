import { EntityParams } from 'src/app/_models/base/entityParams';
import { SubscriptionHistory } from "src/app/_models/subscriptionHistories/subscriptionHistory";

export class SubscriptionHistoryParams extends EntityParams<SubscriptionHistory> {
  doctorId: number | null = null;

  constructor(key: string | null, init?: Partial<SubscriptionHistoryParams>) {
    super(key);
    Object.assign(this, init);
  }
}
