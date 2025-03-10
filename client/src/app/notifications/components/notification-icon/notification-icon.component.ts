import { Component, input, InputSignal } from '@angular/core';
import { NotificationType } from "src/app/_models/notifications/notificationType";
import { TooltipDirective } from "ngx-bootstrap/tooltip";

@Component({
  selector: 'app-notification-icon',
  templateUrl: './notification-icon.component.html',
  styleUrl: './notification-icon.component.scss',
  imports: [
    TooltipDirective
  ],
})
export class NotificationIconComponent {
  protected NotificationType: typeof NotificationType = NotificationType;
  type: InputSignal<NotificationType> = input.required();
}
