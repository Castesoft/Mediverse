import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  model,
  ModelSignal,
  signal,
  Signal,
  WritableSignal
} from '@angular/core';
import { Notification } from "src/app/_models/notifications/notification";
import { BsDropdownMenuDirective, BsDropdownToggleDirective } from "ngx-bootstrap/dropdown";
import {
  NotificationContainerComponent
} from "src/app/_shared/components/notifications/notification-container/notification-container.component";
import { NotificationsService } from "src/app/notifications/notifications.config";
import { RouterLink } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

enum NotificationTab {
  All = 'all',
  Unread = 'unread',
  Read = 'read'
}

@Component({
  host: { class: 'd-flex align-items-center ms-2 ms-lg-3', id: 'notificationsDropdown' },
  selector: '[notificationsDropdown]',
  templateUrl: './notifications-dropdown.component.html',
  imports: [
    BsDropdownToggleDirective,
    BsDropdownMenuDirective,
    NotificationContainerComponent,
    RouterLink
  ]
})
export class NotificationsDropdownComponent {
  protected readonly NotificationTab: typeof NotificationTab = NotificationTab;
  private readonly notificationsService: NotificationsService = inject(NotificationsService);

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  notifications: ModelSignal<Notification[]> = model.required();
  filteredNotifications: Signal<Notification[]> = computed(() => {
    switch (this.selectedTab()) {
      case NotificationTab.All:
        return this.notifications();
      case NotificationTab.Unread:
        return this.notifications().filter((n: Notification) => !n.isRead);
      case NotificationTab.Read:
        return this.notifications().filter((n: Notification) => n.isRead);
    }
  });

  selectedTab: WritableSignal<NotificationTab> = signal(NotificationTab.Unread);
  unreadCount: number = 0;

  constructor() {
    effect(() => {
      this.unreadCount = this.notifications().filter(n => !n.isRead).length;
    });
  }

  markNotificationAsRead(notificationId: number): void {
    this.notificationsService.markAsRead(notificationId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        const notifications: Notification[] = this.notifications();
        const notification: Notification | undefined = notifications.find(n => n.id! === notificationId);

        if (notification) {
          notification.isRead = true;
          this.notifications.set(notifications);
          this.unreadCount = notifications.filter(n => !n.isRead).length;
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  selectTab(tab: NotificationTab, event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedTab.set(tab);
  }
}
