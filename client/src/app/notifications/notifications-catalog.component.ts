import { Component, inject, model, ModelSignal } from "@angular/core";
import { CatalogMode, View, } from "src/app/_models/base/types";
import { Notification } from "src/app/_models/notifications/notification";
import { NotificationParams } from "src/app/_models/notifications/notificationParams";
import { GenericCatalogComponent } from "src/app/_shared/components/catalog-layout.component";
import { NotificationsService } from "src/app/notifications/notifications.config";
import { NotificationFiltersForm } from "src/app/_models/notifications/notificationFiltersForm";
import { ControlsRow3Component } from "src/app/_forms2/builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms2/builder/controls-wrapper-3.component";
import { FormsModule } from "@angular/forms";
import { NotificationsTableComponent } from "src/app/notifications/notifications-table.component";
import { FilterConfiguration } from "src/app/_models/base/filter-types";

@Component({
  selector: '[notificationsCatalog]',
  templateUrl: './notifications-catalog.component.html',
  imports: [
    NotificationsTableComponent,
    FormsModule,
    ControlsRow3Component,
    ControlsWrapper3Component,
    GenericCatalogComponent
  ],
})
export class NotificationsCatalogComponent {
  item: ModelSignal<Notification | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<NotificationParams> = model.required();
  embedded: ModelSignal<boolean> = model.required();
  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration());

  service: NotificationsService = inject(NotificationsService);
  form: ModelSignal<NotificationFiltersForm> = model(new NotificationFiltersForm());
}
