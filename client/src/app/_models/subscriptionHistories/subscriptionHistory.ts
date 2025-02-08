import { Entity } from "src/app/_models/base/entity";

export class SubscriptionHistory extends Entity {
  subscriptionId!: number;
  changedAt!: Date;
  oldStatus!: string;
  newStatus!: string;
  note?: string;

  constructor(init?: Partial<SubscriptionHistory>) {
    super();
    Object.assign(this, init);
  }
}
