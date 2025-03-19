import { CommonModule } from "@angular/common";
import { Component, model, ModelSignal, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import BaseTable from "src/app/_models/base/components/extensions/baseTable";
import TableInputSignals from "src/app/_models/base/components/interfaces/tableInputSignals";
import { CatalogMode, View } from "src/app/_models/base/types";
import { Service } from "src/app/_models/services/service";
import { serviceCells } from "src/app/_models/services/serviceConstants";
import { ServiceFiltersForm } from "src/app/_models/services/serviceFiltersForm";
import { ServiceParams } from "src/app/_models/services/serviceParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { ServicesService } from "src/app/services/services.config";
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[servicesTable]',
  templateUrl: './services-table.component.html',
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
export class ServicesTableComponent extends BaseTable<Service, ServiceParams, ServiceFiltersForm, ServicesService> implements TableInputSignals<Service, ServiceParams> {
  item: ModelSignal<Service | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<ServiceParams> = model.required();
  data: ModelSignal<Service[]> = model.required();

  constructor() {
    super(ServicesService, Service, { tableCells: serviceCells, });
  }
}
