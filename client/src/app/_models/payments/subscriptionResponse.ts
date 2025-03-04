export interface SubscriptionResponse {
  id: number;
  stripeSubscriptionId: string;
  status: string;
  subscriptionStartDate: Date;
}
