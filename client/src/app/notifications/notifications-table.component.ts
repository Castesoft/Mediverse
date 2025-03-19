import { CommonModule } from '@angular/common';
import { Component, effect, input, InputSignal, model, ModelSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ControlsModule } from 'src/app/_forms/controls.module';
import BaseTable from 'src/app/_models/base/components/extensions/baseTable';
import TableInputSignals from 'src/app/_models/base/components/interfaces/tableInputSignals';
import { CatalogMode, View } from 'src/app/_models/base/types';
import { Notification } from 'src/app/_models/notifications/notification';
import { notificationCells } from 'src/app/_models/notifications/notificationConstants';
import { NotificationFiltersForm } from 'src/app/_models/notifications/notificationFiltersForm';
import { NotificationParams } from 'src/app/_models/notifications/notificationParams';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { TablesModule } from 'src/app/_shared/template/components/tables/tables.module';
import { NotificationsService } from 'src/app/notifications/notifications.config';
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";
import { Column } from "src/app/_models/base/column";
import { SiteSection } from "src/app/_models/sections/sectionTypes";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[notificationsTable]',
  templateUrl: './notifications-table.component.html',
  standalone: true,
  imports: [
    TablesModule,
    ControlsModule,
    RouterModule,
    FontAwesomeModule,
    CdkModule,
    MaterialModule,
    CommonModule,
    TableMenuComponent,
  ],
})
export class NotificationsTableComponent extends BaseTable<Notification, NotificationParams, NotificationFiltersForm, NotificationsService> implements TableInputSignals<Notification, NotificationParams> {
  protected readonly SiteSection: typeof SiteSection = SiteSection;

  item: ModelSignal<Notification | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<NotificationParams> = model.required();
  data: ModelSignal<Notification[]> = model.required();

  showDoctorColumn: InputSignal<boolean> = input(false);

  columns: Column[] = [];

  constructor() {
    super(NotificationsService, Notification, { tableCells: notificationCells });

    effect((): void => {
      if (this.columns.length === 0) {
        this.columns = this.service.columns;
      }

      this.service.columns = this.columns.filter((column: Column) => column.name !== 'doctor');
    });
  }

}
