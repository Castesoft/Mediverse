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
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable', id: 'kt_table_events', },
  selector: 'table[eventsTable]',
  standalone: true,
  templateUrl: './events-table.component.html',
  imports: [FontAwesomeModule, TableHeaderComponent, NgClass, FormsModule, RouterModule, DecimalPipe, BsDropdownModule, PatientTableCellComponent, DatePipe,
    PatientTableSexCellComponent, PatientTableHasAccountCellComponent, MaterialModule, CdkModule,
    TooltipModule
  ],
})
export class EventsTableComponent implements OnInit, OnDestroy {
  service = inject(EventsService);
  icons = inject(IconsService);
  utils = inject(UtilsService);

  @Input() data: Event[] = [];
  key = input.required<string>();
  mode = input.required<CatalogMode>();
  showHeaders = input<boolean>(true);
  location = input<'events-catalog' | 'user-detail'>('events-catalog');

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