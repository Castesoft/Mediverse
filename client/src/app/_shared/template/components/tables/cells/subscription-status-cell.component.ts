import { Component, input, InputSignal } from "@angular/core";
import { NgClass } from "@angular/common";
import {
  getTranslatedSubscriptionStatus,
  SubscriptionStatus
} from "src/app/_models/subscriptions/subscriptionConstants";

@Component({
  selector: 'td[subscriptionStatusCell]',
  template: `
    <div class="d-flex align-items-center justify-content-start">
      <div class="badge" [ngClass]="badgeClass">
        {{ getTranslatedSubscriptionStatus(statusString) }}
      </div>
    </div>
  `,
  standalone: true,
  imports: [ NgClass ]
})
export class SubscriptionStatusCellComponent {
  status: InputSignal<SubscriptionStatus> = input.required();

  private readonly badgeMap: { [key: string]: string } = {
    [SubscriptionStatus.Active.toString()]: 'badge-success',
    [SubscriptionStatus.Expired.toString()]: 'badge-danger',
    [SubscriptionStatus.Inactive.toString()]: 'badge-warning',
    [SubscriptionStatus.Pending.toString()]: 'badge-light-primary'
  };

  get badgeClass(): string {
    return this.badgeMap[this.status().toString()] || 'badge-secondary';
  }

  get statusString(): string {
    return this.status().toString();
  }

  getTranslatedSubscriptionStatus: (status: string) => string = getTranslatedSubscriptionStatus;
}
