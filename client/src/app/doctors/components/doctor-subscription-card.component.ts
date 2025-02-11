import { Component, InputSignal, input } from '@angular/core';
import { Subscription } from 'src/app/_models/subscriptions/subscription';
import { getTranslatedSubscriptionStatus } from 'src/app/_models/subscriptions/subscriptionConstants';
import { DatePipe } from "@angular/common";

@Component({
  selector: 'div[doctorSubscriptionCard]',
  standalone: true,
  templateUrl: './doctor-subscription-card.component.html',
  styleUrls: [ './doctor-subscription-card.component.scss' ],
  imports: [ DatePipe ]
})
export class DoctorSubscriptionCardComponent {
  subscription: InputSignal<Subscription | null> = input.required();

  getTranslatedStatus(status: string): string {
    return getTranslatedSubscriptionStatus(status);
  }
}
