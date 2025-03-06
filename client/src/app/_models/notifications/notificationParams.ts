import { EntityParams } from "src/app/_models/base/entityParams";
import { Notification } from "src/app/_models/notifications/notification";

export class NotificationParams extends EntityParams<Notification> {
  constructor(key: string | null) {
    super(key);
  }
}
