import { Component, model, ModelSignal, output, OutputEmitterRef } from '@angular/core';
import { Notification } from "src/app/_models/notifications/notification";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'div[notificationContainer]',
  templateUrl: './notification-container.component.html',
  styleUrl: './notification-container.component.scss',
  imports: [ DatePipe ],
})
export class NotificationContainerComponent {
  notification: ModelSignal<Notification> = model.required();
  onRead: OutputEmitterRef<number> = output();
}
