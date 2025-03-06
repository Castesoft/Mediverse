import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Notification } from "src/app/_models/notifications/notification";
import { notificationFormInfo } from "src/app/_models/notifications/notificationConstants";

export class NotificationForm extends FormGroup2<Notification> {
  constructor() {
    super(Notification, new Notification(), notificationFormInfo);
  }
}
