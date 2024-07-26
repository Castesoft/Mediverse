import { Component, OnInit, Input, inject, input, OnDestroy } from "@angular/core";
import { CatalogMode, Role } from "src/app/_models/types";
import { IconsService } from "src/app/_services/icons.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {CdkModule} from "src/app/_shared/cdk.module";
import {MaterialModule} from "src/app/_shared/material.module";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";
import { DatePipe, DecimalPipe, NgClass } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { Event, EventParams } from "src/app/_models/event";
import { Subscription } from "rxjs";
import { GuidService } from "src/app/_services/guid.service";
import { EventsService } from "src/app/_services/events.service";
import {PatientTableCellComponent, PatientTableHasAccountCellComponent, PatientTableSexCellComponent} from "src/app/_shared/components/patient-table-cell.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable', id: 'kt_table_events', },
  selector: 'table[eventsTable]',
  standalone: true,
  templateUrl: './events-table.component.html',
  imports: [FontAwesomeModule, TableHeaderComponent, NgClass, FormsModule, RouterModule, DecimalPipe, BsDropdownModule, PatientTableCellComponent, DatePipe,
    PatientTableSexCellComponent, PatientTableHasAccountCellComponent, MaterialModule, CdkModule,
  ],
})
export class EventsTableComponent implements OnInit, OnDestroy {
  service = inject(EventsService);
  icons = inject(IconsService);

  @Input() data: Event[] = [];
  key = input.required<string>();
  mode = input.required<CatalogMode>();
  showHeaders = input<boolean>(true);

  sortAscending = false;
  columns = this.service.columns;
  devMode = false;
  params!: EventParams;

  subscriptions: Subscription[] = [];

  cuid: string;
  constructor(guid: GuidService) {
    this.cuid = guid.gen();
  }

  ngOnInit(): void {
    const paramsSubscription = this.service.param$(this.key()).subscribe({ next: params => this.params = params });
    this.subscriptions.push(paramsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
