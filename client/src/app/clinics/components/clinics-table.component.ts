import { CommonModule } from "@angular/common";
import { Component, OnInit, ModelSignal, model, OnDestroy, effect } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import BaseTable from "src/app/_models/base/components/extensions/baseTable";
import TableInputSignals from "src/app/_models/base/components/interfaces/tableInputSignals";
import { View, CatalogMode } from "src/app/_models/base/types";
import Clinic from "src/app/_models/clinics/clinic";
import { clinicCells } from "src/app/_models/clinics/clinicConstants";
import ClinicFiltersForm from "src/app/_models/clinics/clinicFiltersForm";
import ClinicParams from "src/app/_models/clinics/clinicParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { ClinicsService } from "src/app/clinics/clinics.config";
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[clinicsTable]',
  templateUrl: './clinics-table.component.html',
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
export class ClinicsTableComponent
  extends BaseTable<Clinic, ClinicParams, ClinicFiltersForm, ClinicsService>
  implements OnInit, OnDestroy, TableInputSignals<Clinic, ClinicParams>
{
  item: ModelSignal<Clinic | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<ClinicParams> = model.required();
  data: ModelSignal<Clinic[]> = model.required();

  constructor() {
    super(ClinicsService, Clinic, { tableCells: clinicCells, });

    effect(() => {});
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
