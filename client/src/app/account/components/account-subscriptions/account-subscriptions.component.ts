import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { DoctorSubscriptionCardComponent } from "src/app/doctors/components/doctor-subscription-card.component";
import { AccountService } from "src/app/_services/account.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Subscription } from "src/app/_models/subscriptions/subscription";
import {
  AccountChildWrapperComponent
} from "src/app/account/components/account-child-wrapper/account-child-wrapper.component";

@Component({
  selector: 'app-account-subscriptions',
  templateUrl: './account-subscriptions.component.html',
  styleUrl: './account-subscriptions.component.scss',
  imports: [
    DoctorSubscriptionCardComponent,
    AccountChildWrapperComponent
  ],
})
export class AccountSubscriptionsComponent implements OnInit {
  private readonly accountService: AccountService = inject(AccountService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  activeSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.subscribeToActiveSubscription();
  }

  private subscribeToActiveSubscription() {
    this.accountService.activeSubscription$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (subscription: Subscription | null) => {
        this.activeSubscription = subscription;
      },
    });
  }
}
