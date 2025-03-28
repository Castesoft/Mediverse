import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  InputSignal,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsDropdownDirective, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MobileQueryService } from 'src/app/_services/mobile-query.service';
import { SidebarService } from 'src/app/_services/sidebar.service';
import { HeaderSearchComponent } from 'src/app/_shared/template/components/headers/header-search.component';
import { ThemeDropdownComponent } from 'src/app/_shared/template/components/theme-dropdown.component';
import { UserDropdownComponent } from 'src/app/_shared/template/components/user-dropdown.component';
import { NotificationRealtimeService } from "src/app/_services/notification-realtime.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NotificationsService } from "src/app/notifications/notifications.config";
import { AccountService } from "src/app/_services/account.service";
import { Account } from "src/app/_models/account/account";
import { Notification } from "src/app/_models/notifications/notification";
import {
  NotificationsDropdownComponent
} from "src/app/_shared/components/notifications/notifications-dropdown/notifications-dropdown.component";
import {
  StripeConnectOnboardingDropdownComponent
} from "src/app/_shared/components/stripe/stripe-connect-onboarding-dropdown/stripe-connect-onboarding-dropdown.component";

@Component({
  selector: '[header]',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ],
  providers: [ BsDropdownDirective, ],
  imports: [
    RouterModule,
    ThemeDropdownComponent,
    UserDropdownComponent,
    BsDropdownModule,
    HeaderSearchComponent,
    CommonModule,
    NotificationsDropdownComponent,
    StripeConnectOnboardingDropdownComponent
  ],
})
export class HeaderComponent implements OnInit {
  private readonly notificationRealtimeService: NotificationRealtimeService = inject(NotificationRealtimeService);
  private readonly notificationsService: NotificationsService = inject(NotificationsService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  readonly mobileQueryService: MobileQueryService = inject(MobileQueryService);
  readonly accountService: AccountService = inject(AccountService);
  readonly sidebarService: SidebarService = inject(SidebarService);

  compact: InputSignal<boolean> = input(false);

  account: Account | null = null;
  notifications: WritableSignal<Notification[]> = signal([]);

  constructor() {
    effect(() => {
      this.account = this.accountService.current();
      this.retrieveUserNotifications();
      this.verifyOnboardingStatus();
    });
  }

  ngOnInit(): void {
    this.subscribeToNotifications();
    this.subscribeToNotificationServerUpdates();
  }

  private subscribeToNotifications(): void {
    this.notificationRealtimeService.getNotification().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (notification) => {
        if (notification) {
          console.log('Received notification:', notification);
        }
      }
    });
  }

  private subscribeToNotificationServerUpdates(): void {
    this.notificationsService.serverUpdate$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (_) => {
        this.retrieveUserNotifications();
      }
    });
  }

  private verifyOnboardingStatus(): void {
    if (this.account) {
      this.accountService.verifyAndUpdateStripeOnboardingStatus(this.account.id!).subscribe(({ isOnboarded }) => {
        if (this.account?.isStripeConnectAccountOnboarded !== isOnboarded) {
          this.accountService.setCurrentUser({ ...this.account!, isStripeConnectAccountOnboarded: isOnboarded });
        }
      })
    }
  }

  private retrieveUserNotifications(): void {
    if (!this.account) {
      console.error('Account is not set.');
      return;
    }

    this.notificationsService.getForUserByUserId(this.account.id!).subscribe({
      next: (notifications) => {
        this.notifications.set(notifications);
      }
    });
  }
}
