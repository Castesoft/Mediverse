import { Component, OnInit, Input, inject, input, OnDestroy } from "@angular/core";
import { CatalogMode, Role } from "src/app/_models/types";
import { IconsService } from "src/app/_services/icons.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {CdkModule} from "src/app/_shared/cdk.module";
import {MaterialModule} from "src/app/_shared/material.module";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { Service, ServiceParams } from "src/app/_models/service";
import { Subscription } from "rxjs";
import { GuidService } from "src/app/_services/guid.service";
import { ServicesService } from "src/app/_services/services.service";
import {ServiceTableCellComponent, ServiceTableHasAccountCellComponent, ServiceTableSexCellComponent} from "src/app/services/components/service-table-cell.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable', id: 'kt_table_services', },
  selector: 'table[servicesTable]',
  standalone: true,
  templateUrl: './services-table.component.html',
  imports: [FontAwesomeModule, TableHeaderComponent, NgClass, FormsModule, RouterModule, DecimalPipe, BsDropdownModule, ServiceTableCellComponent, DatePipe,
    ServiceTableSexCellComponent, ServiceTableHasAccountCellComponent, MaterialModule, CdkModule, CurrencyPipe,
  ],
})
export class ServicesTableComponent implements OnInit, OnDestroy {
  service = inject(ServicesService);
  icons = inject(IconsService);

  @Input() data: Service[] = [];
  key = input.required<string>();
  mode = input.required<CatalogMode>();
  showHeaders = input<boolean>(true);

  sortAscending = false;
  columns = this.service.columns;
  devMode = false;
  params!: ServiceParams;

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
