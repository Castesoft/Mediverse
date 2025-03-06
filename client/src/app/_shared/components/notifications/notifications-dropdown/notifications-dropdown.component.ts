import { Component, effect, inject, model, ModelSignal } from '@angular/core';
import { Notification } from "src/app/_models/notifications/notification";
import { BsDropdownMenuDirective, BsDropdownToggleDirective } from "ngx-bootstrap/dropdown";
import {
  NotificationContainerComponent
} from "src/app/_shared/components/notifications/notification-container/notification-container.component";
import { NotificationsService } from "src/app/notifications/notifications.config";

@Component({
  host: { class: 'd-flex align-items-center ms-2 ms-lg-3', id: 'notificationsDropdown' },
  selector: '[notificationsDropdown]',
  templateUrl: './notifications-dropdown.component.html',
  imports: [
    BsDropdownToggleDirective,
    BsDropdownMenuDirective,
    NotificationContainerComponent
  ]
})
export class NotificationsDropdownComponent {
  private notificationsService: NotificationsService = inject(NotificationsService);
  notifications: ModelSignal<Notification[]> = model.required();

  hasPending: boolean = false;

  constructor() {
    effect(() => {
      this.hasPending = this.notifications().some(n => !n.isRead);
    });
  }

  markNotificationAsRead(notificationId: number): void {
    this.notificationsService.markAsRead(notificationId).subscribe({
      next: () => {
        const notifications: Notification[] = this.notifications();
        const notification: Notification | undefined = notifications.find(n => n.id! === notificationId);

        if (notification) {
          notification.isRead = true;
          this.notifications.set(notifications);
          this.hasPending = notifications.some(n => !n.isRead);
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }
}
