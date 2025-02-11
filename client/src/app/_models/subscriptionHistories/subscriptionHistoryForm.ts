import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { SubscriptionHistory } from "src/app/_models/subscriptionHistories/subscriptionHistory";
import { subscriptionHistoryFormInfo } from "src/app/_models/subscriptionHistories/subscriptionHistoryConstants";


export class SubscriptionHistoryForm extends FormGroup2<SubscriptionHistory> {
  constructor() {
    super(SubscriptionHistory, new SubscriptionHistory(), subscriptionHistoryFormInfo);
  }
}
