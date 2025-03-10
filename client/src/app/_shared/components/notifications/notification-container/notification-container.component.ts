import { Component, model, ModelSignal, output, OutputEmitterRef } from '@angular/core';
import { Notification } from "src/app/_models/notifications/notification";
import {
  NotificationIconComponent
} from "src/app/notifications/components/notification-icon/notification-icon.component";
import { RelativeTimePipe } from "src/app/_pipes/relative-time.pipe";

@Component({
  selector: 'div[notificationContainer]',
  templateUrl: './notification-container.component.html',
  styleUrl: './notification-container.component.scss',
  imports: [ NotificationIconComponent, RelativeTimePipe ],
})
export class NotificationContainerComponent {
  notification: ModelSignal<Notification> = model.required();
  onRead: OutputEmitterRef<number> = output();
}
