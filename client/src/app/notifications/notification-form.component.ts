import { Component, model, ModelSignal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseForm from "src/app/_models/base/components/extensions/baseForm";
import { Notification } from "src/app/_models/notifications/notification";
import { NotificationParams } from "src/app/_models/notifications/notificationParams";
import { NotificationFiltersForm } from "src/app/_models/notifications/notificationFiltersForm";
import { NotificationForm } from "src/app/_models/notifications/notificationForm";
import { FormInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { View } from "src/app/_models/base/types";
import { NotificationsService } from "src/app/notifications/notifications.config";

@Component({
  selector: "[notificationForm]",
  templateUrl: './notification-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ControlsModule,
    Forms2Module,
  ]
})
export class NotificationFormComponent extends BaseForm<Notification, NotificationParams, NotificationFiltersForm, NotificationForm, NotificationsService> implements FormInputSignals<Notification> {
  item: ModelSignal<Notification | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();

  constructor() {
    super(NotificationsService, NotificationForm);
  }
}
