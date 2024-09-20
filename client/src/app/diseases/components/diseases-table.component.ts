import { CommonModule } from '@angular/common';
import {
  Component, InputSignal,
  OnDestroy,
  OnInit,
  effect,
  inject,
  input
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { createId } from '@paralleldrive/cuid2';
import { Subject, takeUntil } from 'rxjs';
import { ControlsModule } from 'src/app/_forms/controls.module';
import {
  CatalogMode,
  ITableMenu,
  PartialCellsOf,
  TableCellItem,
  TableMenu,
  TableRow,
  View,
} from 'src/app/_models/types';
import { EnvService } from 'src/app/_services/env.service';
import { IconsService } from 'src/app/_services/icons.service';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { TableModule } from 'src/app/_shared/table/table.module';
import {
  Disease,
  DiseaseParams,
  DiseasesService,
} from 'src/app/diseases/diseases.config';

@Component({
  selector: 'div[diseasesTableMenu]',
  host: { class: '' },
  template: `
    <div class="dropdown-menu d-block" cdkMenu>
      <a
        cdkMenuItem
        class="dropdown-item px-3"
        [href]="service.dictionary.Diseases.catalogRoute + '/' + item().id"
        (click)="
          service.clickLink(item(), key(), 'detail', 'page');
          $event.preventDefault()
        "
      >
        Ver {{ service.dictionary.Diseases.singular }}
      </a>
      <a
        cdkMenuItem
        class="dropdown-item px-3"
        [href]="service.dictionary.Diseases.catalogRoute + '/' + item().id"
        (click)="
          $event.preventDefault();
          service.clickLink(item(), key(), 'detail', 'modal')
        "
      >
        Abrir {{ service.dictionary.Diseases.singular }} en pantalla modal
      </a>
      <a
        cdkMenuItem
        class="dropdown-item px-3"
        [routerLink]="[service.dictionary.Diseases.catalogRoute, item().id, 'editar']"
      >
        Editar
      </a>
      <button
        cdkMenuItem
        class="dropdown-item px-3 text-danger"
        (click)="service.delete$(item(), 'Diseases')"
      >
        Eliminar
      </button>
    </div>
  `,
  standalone: true,
  imports: [RouterModule, CdkModule, MaterialModule],
})
export class DiseasesTableMenuComponent
  extends TableMenu<DiseasesService>
  implements OnInit, ITableMenu<Disease>
{
  item: InputSignal<Disease> = input.required();
  key: InputSignal<string> = input.required();

  constructor() {
    super(DiseasesService);
  }

  ngOnInit(): void {}
}

@Component({
  host: { class: 'table mb-0 border-translucent' },
  selector: 'table[diseasesTable]',
  template: `
    <thead
      tableHeader
      [columns]="service.columns['Diseases']"
      [params]="params"
      (onParamsChange)="service.onSortOptionsChange(key(), $event)"
      [mode]="mode()"
      (selectedChange)="service.onSelectAll(key(), mode(), $event)"
      [selected]="(service.areAllSelected(key()) | async)!"
    ></thead>
    <tbody class="list" id="leal-tables-body">
      @for (item of data(); track item.id; let idx = $index) {
        <tr
          class="hover-actions-trigger btn-reveal-trigger position-static"
          [cdkContextMenuTriggerFor]="context_menu"
        >
          <td
            tableCheckCell
            [idx]="idx"
            [dictionary]="service.dictionary.Diseases"
            [(selected)]="item.isSelected"
            (click)="service.onSelect(key(), mode(), item)"
          ></td>

          <td
            class="name align-middle white-space-nowrap px-0 py-0"
          >
            <div class="d-flex align-items-center justify-content-start px-0">
              <a
                [routerLink]="[service.dictionary.Diseases.catalogRoute, item.id]"
                [href]="[service.dictionary.Diseases.catalogRoute, item.id]"
                class="fw-semibold text-primary"
                >#{{ item.id }}</a
              >
            </div>
          </td>

          @for (
            cell of row.getItems([
              'code',
              'name',
              'description',
              'createdAt',
              'visible',
              'enabled',
            ]);
            let idx = $index;
            track idx
          ) {
            <td
              tableCell2
              [item]="cells[cell.item.key]!"
              [value]="item[cell.item.key]"
            ></td>
          }

          <td
            tableMenuCell
            [item]="item"
            [contextMenu]="context_menu"
          ></td>
          <ng-template #context_menu>
            <div diseasesTableMenu [item]="item" [key]="key()"></div>
          </ng-template>
        </tr>
      }
    </tbody>
  `,
  standalone: true,
  imports: [
    TableModule,
    ControlsModule,
    RouterModule,
    FontAwesomeModule,
    CdkModule,
    MaterialModule,
    CommonModule,
    DiseasesTableMenuComponent,
  ],
})
export class DiseasesTableComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  service = inject(DiseasesService);
  icons = inject(IconsService);
  dev = inject(EnvService);

  data = input.required<Disease[]>();
  mode = input.required<CatalogMode>();
  key = input.required<string>();
  view = input.required<View>();

  sortAscending = false;
  devMode = false;
  params!: DiseaseParams;
  cuid = createId();
  selected = false;
  row: TableRow<Disease> = new TableRow<Disease>(new Disease());

  cells: PartialCellsOf<Disease> = {
    createdAt: new TableCellItem<Date, 'createdAt'>('createdAt', 'date'),
    description: new TableCellItem<string, 'description'>('description', 'string'),
    enabled: new TableCellItem<boolean, 'enabled'>('enabled', 'boolean'),
    name: new TableCellItem<string, 'name'>('name', 'string'),
    code: new TableCellItem<string, 'code'>('code', 'string'),
    visible: new TableCellItem<boolean, 'visible'>('visible', 'boolean'),
    id: new TableCellItem<number, 'id'>('id', 'number'),
  };

  constructor() {
    effect(() => {
      this.params = new DiseaseParams(this.key());
      this.service.param$(this.key(), this.mode()).subscribe({
        next: (params) => {
          this.params = params;
        },
      });
    });
  }

  ngOnInit(): void {
    this.subscribeToDevMode();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private subscribeToDevMode = () => {
    this.dev.mode$.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (devMode) => (this.devMode = devMode),
    });
  };
}
