import { CommonModule } from "@angular/common";
import { Component, OnInit, ModelSignal, model, OnDestroy, effect } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import BaseTable from "src/app/_models/base/components/extensions/baseTable";
import TableInputSignals from "src/app/_models/base/components/interfaces/tableInputSignals";
import { View, CatalogMode } from "src/app/_models/base/types";
import Patient from "src/app/_models/patients/patient";
import { patientCells } from "src/app/_models/patients/patientConstants";
import { PatientFiltersForm } from "src/app/_models/patients/patientFiltersForm";
import { PatientParams } from "src/app/_models/patients/patientParams";
import { TableMenu } from "src/app/_models/tables/extensions/tableComponentExtensions";
import { ITableMenu } from "src/app/_models/tables/interfaces/tableComponentInterfaces";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { PatientsService } from "src/app/patients/patients.config";

@Component({
  selector: 'div[patientsTableMenu]',
  host: { class: '' },
  template: `
    <div class="dropdown-menu d-block" cdkMenu>
      <a
        cdkMenuItem
        class="dropdown-item px-3"
        [href]="service.dictionary.catalogRoute + '/' + item().id"
        (click)="
          service.clickLink(item(), key(), 'detail', 'page');
          $event.preventDefault()
        "
      >
        Ver {{ service.dictionary.singular }}
      </a>
      <a
        cdkMenuItem
        class="dropdown-item px-3"
        [href]="service.dictionary.catalogRoute + '/' + item().id"
        (click)="
          $event.preventDefault();
          service.clickLink(item(), key(), 'detail', 'modal')
        "
      >
        Abrir {{ service.dictionary.singular }} en pantalla modal
      </a>
      <a
        cdkMenuItem
        class="dropdown-item px-3"
        [routerLink]="[service.dictionary.catalogRoute, item().id, 'editar']"
      >
        Editar
      </a>
      <button
        cdkMenuItem
        class="dropdown-item px-3 text-danger"
        (click)="service.delete$(item())"
      >
        Eliminar
      </button>
    </div>
  `,
  standalone: true,
  imports: [RouterModule, CdkModule, MaterialModule],
})
export class PatientsTableMenuComponent
  extends TableMenu<PatientsService>
  implements OnInit, ITableMenu<Patient>
{
  item: ModelSignal<Patient> = model.required();
  key: ModelSignal<string | null> = model.required();

  constructor() {
    super(PatientsService);
  }

  ngOnInit(): void {}
}

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[patientsTable]',
  // template: ``,
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
    PatientsTableMenuComponent,
  ],
})
export class PatientsTableComponent
  extends BaseTable<Patient, PatientParams, PatientFiltersForm, PatientsService>
  implements OnInit, OnDestroy, TableInputSignals<Patient, PatientParams>
{
  item: ModelSignal<Patient | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<PatientParams> = model.required();
  data: ModelSignal<Patient[]> = model.required();

  constructor() {
    super(PatientsService, Patient, { tableCells: patientCells, });

    effect(() => {});
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
