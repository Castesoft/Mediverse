import { CommonModule } from '@angular/common';
import { Component, OnInit, ModelSignal, model, OnDestroy, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ControlsModule } from 'src/app/_forms/controls.module';
import BaseTable from 'src/app/_models/base/components/extensions/baseTable';
import TableInputSignals from 'src/app/_models/base/components/interfaces/tableInputSignals';
import { View, CatalogMode } from 'src/app/_models/base/types';
import Nurse from 'src/app/_models/nurses/nurse';
import { nurseCells } from 'src/app/_models/nurses/nurseConstants';
import { NurseFiltersForm } from 'src/app/_models/nurses/nurseFiltersForm';
import { NurseParams } from 'src/app/_models/nurses/nurseParams';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { TablesModule } from 'src/app/_shared/template/components/tables/tables.module';
import { NursesService } from 'src/app/nurses/nurses.config';
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[nursesTable]',
  templateUrl: './nurses-table.component.html',
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
export class NursesTableComponent
  extends BaseTable<Nurse, NurseParams, NurseFiltersForm, NursesService>
  implements OnInit, OnDestroy, TableInputSignals<Nurse, NurseParams>
{
  item: ModelSignal<Nurse | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<NurseParams> = model.required();
  data: ModelSignal<Nurse[]> = model.required();

  constructor() {
    super(NursesService, Nurse, { tableCells: nurseCells, });

    effect(() => {});
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
