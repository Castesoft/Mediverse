import { CommonModule } from "@angular/common";
import { Component, OnInit, ModelSignal, model, OnDestroy, effect } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Clinic } from "src/app/_models/clinics/clinic";
import { clinicCells } from "src/app/_models/clinics/clinicConstants";
import { ClinicFiltersForm } from "src/app/_models/clinics/clinicFiltersForm";
import { ClinicParams } from "src/app/_models/clinics/clinicParams";
import BaseTable from "src/app/_models/base/components/extensions/baseTable";
import TableInputSignals from "src/app/_models/base/components/interfaces/tableInputSignals";
import { View, CatalogMode } from "src/app/_models/base/types";
import { TableMenu } from "src/app/_models/tables/extensions/tableComponentExtensions";
import { ITableMenu } from "src/app/_models/tables/interfaces/tableComponentInterfaces";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { ClinicsService } from "src/app/clinics/clinics.config";

@Component({
  selector: 'div[clinicsTableMenu]',
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
export class ClinicsTableMenuComponent
  extends TableMenu<ClinicsService>
  implements OnInit, ITableMenu<Clinic>
{
  item: ModelSignal<Clinic> = model.required();
  key: ModelSignal<string | null> = model.required();

  constructor() {
    super(ClinicsService);
  }

  ngOnInit(): void {}
}

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[clinicsTable]',
  // template: ``,
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
    ClinicsTableMenuComponent,
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
