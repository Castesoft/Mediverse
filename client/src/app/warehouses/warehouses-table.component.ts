import { CommonModule } from '@angular/common';
import { Component, effect, input, model, ModelSignal, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ControlsModule } from 'src/app/_forms/controls.module';
import BaseTable from 'src/app/_models/base/components/extensions/baseTable';
import TableInputSignals from 'src/app/_models/base/components/interfaces/tableInputSignals';
import { CatalogMode, View } from 'src/app/_models/base/types';
import { Warehouse } from 'src/app/_models/warehouses/warehouse';
import { warehouseCells } from 'src/app/_models/warehouses/warehouseConstants';
import { WarehouseFiltersForm } from 'src/app/_models/warehouses/warehouseFiltersForm';
import { WarehouseParams } from 'src/app/_models/warehouses/warehouseParams';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { TablesModule } from 'src/app/_shared/template/components/tables/tables.module';
import { WarehousesService } from 'src/app/warehouses/warehouses.config';
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";
import { Column } from "src/app/_models/base/column";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import {
  AddressTableCellComponent
} from "src/app/_shared/template/components/tables/cells/address-table-cell.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[warehousesTable]',
  templateUrl: './warehouses-table.component.html',
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
    AddressTableCellComponent,
  ],
})
export class WarehousesTableComponent extends BaseTable<Warehouse, WarehouseParams, WarehouseFiltersForm, WarehousesService> implements OnDestroy, TableInputSignals<Warehouse, WarehouseParams> {
  item: ModelSignal<Warehouse | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<WarehouseParams> = model.required();
  data: ModelSignal<Warehouse[]> = model.required();

  columns: Column[] = [];
  showDoctorColumn = input<boolean>(false);

  constructor() {
    super(WarehousesService, Warehouse, { tableCells: warehouseCells });

    effect((): void => {
      if (this.columns.length === 0) {
        this.columns = this.service.columns;
      }

      this.service.columns = this.columns.filter(column => column.name !== 'doctor');
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  protected readonly SiteSection = SiteSection;
}
