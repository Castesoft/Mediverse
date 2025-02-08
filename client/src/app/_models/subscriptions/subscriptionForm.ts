import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Subscription } from "src/app/_models/subscriptions/subscription";
import { subscriptionFormInfo } from "src/app/_models/subscriptions/subscriptionConstants";


export class SubscriptionForm extends FormGroup2<Subscription> {
  constructor() {
    super(Subscription, new Subscription(), subscriptionFormInfo);
  }
}
