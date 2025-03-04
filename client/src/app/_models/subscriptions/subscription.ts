import { Entity } from "src/app/_models/base/entity";
import { SubscriptionHistory } from "src/app/_models/subscriptionHistories/subscriptionHistory";
import { SubscriptionStatus } from "src/app/_models/subscriptions/subscriptionConstants";

export class Subscription extends Entity {
  userId!: number;
  planId!: number;
  price!: number;
  planName!: string;
  startDate!: Date;
  endDate?: Date;
  status!: SubscriptionStatus;
  nextBillingDate?: Date;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  stripePlanId?: string;
  histories?: SubscriptionHistory[];

  constructor(init?: Partial<Subscription>) {
    super();
    Object.assign(this, init);
  }
}
