import { Entity } from "src/app/_models/base/entity";
import { SubscriptionHistory } from "src/app/_models/subscriptionHistories/subscriptionHistory";
import { SubscriptionStatus } from "src/app/_models/subscriptions/subscriptionConstants";

export class Subscription extends Entity {
  userId!: number;
  subscriptionPlanId!: number;
  subscriptionPlanName!: string;
  subscriptionStartDate!: Date;
  subscriptionEndDate?: Date;
  status!: SubscriptionStatus;
  nextBillingDate?: Date;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  subscriptionHistories?: SubscriptionHistory[];

  constructor(init?: Partial<Subscription>) {
    super();
    Object.assign(this, init);
  }
}
