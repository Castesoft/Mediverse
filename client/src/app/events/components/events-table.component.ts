import { CommonModule } from "@angular/common";
import { Component, inject, Input, input, model, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { createId } from "@paralleldrive/cuid2";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { Subscription } from "rxjs";
import { CatalogMode } from "src/app/_models/base/types";
import { EventParams } from "src/app/_models/events/eventParams";
import { Event } from "src/app/_models/events/event";
import { EventsService } from "src/app/_services/events.service";
import { IconsService } from "src/app/_services/icons.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { PatientTableCellComponent, PatientTableSexCellComponent, PatientTableHasAccountCellComponent } from "src/app/_shared/components/patient-table-cell.component";
import { MaterialModule } from "src/app/_shared/material.module";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable', id: 'kt_table_events', },
  selector: 'table[eventsTable]',
  standalone: true,
  templateUrl: './events-table.component.html',
  imports: [FontAwesomeModule, TableHeaderComponent, CommonModule, FormsModule, RouterModule, BsDropdownModule, PatientTableCellComponent,
    PatientTableSexCellComponent, PatientTableHasAccountCellComponent, MaterialModule, CdkModule,
  ],
})
export class EventsTableComponent implements OnInit, OnDestroy {
  service = inject(EventsService);
  icons = inject(IconsService);

  @Input() data: Event[] = [];
  key = model.required<string>();
  mode = model.required<CatalogMode>();
  showHeaders = input<boolean>(true);

  sortAscending = false;
  columns = this.service.columns;
  devMode = false;
  params!: EventParams;

  subscriptions: Subscription[] = [];

  cuid: string = createId();
  constructor() {}

  ngOnInit(): void {
    console.log(this.data);
    const paramsSubscription = this.service.param$(this.key()).subscribe({ next: params => this.params = params });
    this.subscriptions.push(paramsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
