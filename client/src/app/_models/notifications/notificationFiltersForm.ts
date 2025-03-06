import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { notificationFiltersFormInfo } from "src/app/_models/notifications/notificationConstants";
import { NotificationParams } from "src/app/_models/notifications/notificationParams";

export class NotificationFiltersForm extends FormGroup2<NotificationParams> {
  constructor() {
    super(NotificationParams as any, new NotificationParams(createId()), notificationFiltersFormInfo);
  }
}
