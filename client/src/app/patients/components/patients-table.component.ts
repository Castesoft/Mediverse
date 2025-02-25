import { CommonModule } from "@angular/common";
import { Component, model, ModelSignal, OnDestroy } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import BaseTable from "src/app/_models/base/components/extensions/baseTable";
import TableInputSignals from "src/app/_models/base/components/interfaces/tableInputSignals";
import { CatalogMode, View } from "src/app/_models/base/types";
import { Patient } from "src/app/_models/patients/patient";
import { patientCells } from "src/app/_models/patients/patientConstants";
import { PatientFiltersForm } from "src/app/_models/patients/patientFiltersForm";
import { PatientParams } from "src/app/_models/patients/patientParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { PatientsService } from "src/app/patients/patients.config";
import { UserTableCellComponent } from "../../users/components/user-table-cell.component";
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[patientsTable]',
  templateUrl: './patients-table.component.html',
  standalone: true,
  imports: [
    TablesModule,
    ControlsModule,
    RouterModule,
    FontAwesomeModule,
    CdkModule,
    MaterialModule,
    CommonModule,
    UserTableCellComponent,
    TableMenuComponent,
  ],
})
export class PatientsTableComponent extends BaseTable<Patient, PatientParams, PatientFiltersForm, PatientsService> implements OnDestroy, TableInputSignals<Patient, PatientParams> {
  item: ModelSignal<Patient | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<PatientParams> = model.required();
  data: ModelSignal<Patient[]> = model.required();

  constructor() {
    super(PatientsService, Patient, { tableCells: patientCells, });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
