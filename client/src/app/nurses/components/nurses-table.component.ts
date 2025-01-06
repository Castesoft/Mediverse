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
import { TableMenu } from 'src/app/_models/tables/extensions/tableComponentExtensions';
import { ITableMenu } from 'src/app/_models/tables/interfaces/tableComponentInterfaces';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { TablesModule } from 'src/app/_shared/template/components/tables/tables.module';
import { NursesService } from 'src/app/nurses/nurses.config';

@Component({
  selector: 'div[nursesTableMenu]',
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
export class NursesTableMenuComponent
  extends TableMenu<NursesService>
  implements OnInit, ITableMenu<Nurse>
{
  item: ModelSignal<Nurse> = model.required();
  key: ModelSignal<string | null> = model.required();

  constructor() {
    super(NursesService);
  }

  ngOnInit(): void {}
}

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
    NursesTableMenuComponent,
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
