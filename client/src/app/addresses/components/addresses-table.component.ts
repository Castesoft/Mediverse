import { CommonModule } from "@angular/common";
import { Component, model, ModelSignal, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Address } from "src/app/_models/addresses/address";
import { addressCells } from "src/app/_models/addresses/addressConstants";
import { AddressFiltersForm } from "src/app/_models/addresses/addressFiltersForm";
import { AddressParams } from "src/app/_models/addresses/addressParams";
import BaseTable from "src/app/_models/base/components/extensions/baseTable";
import TableInputSignals from "src/app/_models/base/components/interfaces/tableInputSignals";
import { CatalogMode, View } from "src/app/_models/base/types";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { AddressesService } from "src/app/addresses/addresses.config";
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";


@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[addressesTable]',
  templateUrl: './addresses-table.component.html',
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
export class AddressesTableComponent extends BaseTable<Address, AddressParams, AddressFiltersForm, AddressesService> implements TableInputSignals<Address, AddressParams> {
  item: ModelSignal<Address | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<AddressParams> = model.required();
  data: ModelSignal<Address[]> = model.required();

  constructor() {
    super(AddressesService, Address, { tableCells: addressCells, });
  }
}
