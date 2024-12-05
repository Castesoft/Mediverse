import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy, inject, Input, model, input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { createId } from "@paralleldrive/cuid2";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { Subscription } from "rxjs";
import { CatalogMode } from "src/app/_models/base/types";
import { Event, EventParams } from "src/app/_models/event";
import { EventsService } from "src/app/_services/events.service";
import { IconsService } from "src/app/_services/icons.service";
import { UtilsService } from "src/app/_services/utils.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { PatientTableCellComponent, PatientTableSexCellComponent, PatientTableHasAccountCellComponent } from "src/app/_shared/components/patient-table-cell.component";
import { MaterialModule } from "src/app/_shared/material.module";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable', id: 'kt_table_events', },
  selector: 'table[eventsTable]',
  standalone: true,
  templateUrl: './events-table.component.html',
  imports: [FontAwesomeModule, TableHeaderComponent, FormsModule, RouterModule, BsDropdownModule, PatientTableCellComponent, CommonModule,
    PatientTableSexCellComponent, PatientTableHasAccountCellComponent, MaterialModule, CdkModule,
    TooltipModule
  ],
})
export class EventsTableComponent implements OnInit, OnDestroy {
  service = inject(EventsService);
  icons = inject(IconsService);
  utils = inject(UtilsService);

  @Input() data: Event[] = [];
  key = model.required<string>();
  mode = model.required<CatalogMode>();
  showHeaders = input<boolean>(true);
  location = input<'events-catalog' | 'user-detail'>('events-catalog');

  sortAscending = false;
  columns = this.service.columns;
  devMode = false;
  params!: EventParams;

  subscriptions: Subscription[] = [];

  cuid: string = createId();
  constructor() {}

  ngOnInit(): void {
    const paramsSubscription = this.service.param$(this.key()).subscribe({ next: params => this.params = params });
    this.subscriptions.push(paramsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getContrastColor(hexColor: string): string {
    // Remove the hash if it's there
    hexColor = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for bright colors, white for dark colors
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }
}
