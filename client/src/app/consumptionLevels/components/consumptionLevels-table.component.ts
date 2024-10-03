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
  ConsumptionLevel,
  ConsumptionLevelParams,
  ConsumptionLevelsService,
} from 'src/app/consumptionLevels/consumptionLevels.config';

@Component({
  selector: 'div[consumptionLevelsTableMenu]',
  host: { class: '' },
  template: `
    <div class="dropdown-menu d-block" cdkMenu>
      <a
        cdkMenuItem
        class="dropdown-item px-3"
        [href]="service.dictionary.ConsumptionLevels.catalogRoute + '/' + item().id"
        (click)="
          service.clickLink(item(), key(), 'detail', 'page');
          $event.preventDefault()
        "
      >
        Ver {{ service.dictionary.ConsumptionLevels.singular }}
      </a>
      <a
        cdkMenuItem
        class="dropdown-item px-3"
        [href]="service.dictionary.ConsumptionLevels.catalogRoute + '/' + item().id"
        (click)="
          $event.preventDefault();
          service.clickLink(item(), key(), 'detail', 'modal')
        "
      >
        Abrir {{ service.dictionary.ConsumptionLevels.singular }} en pantalla modal
      </a>
      <a
        cdkMenuItem
        class="dropdown-item px-3"
        [routerLink]="[service.dictionary.ConsumptionLevels.catalogRoute, item().id, 'editar']"
      >
        Editar
      </a>
      <button
        cdkMenuItem
        class="dropdown-item px-3 text-danger"
        (click)="service.delete$(item(), 'ConsumptionLevels')"
      >
        Eliminar
      </button>
    </div>
  `,
  standalone: true,
  imports: [RouterModule, CdkModule, MaterialModule],
})
export class ConsumptionLevelsTableMenuComponent
  extends TableMenu<ConsumptionLevelsService>
  implements OnInit, ITableMenu<ConsumptionLevel>
{
  item: InputSignal<ConsumptionLevel> = input.required();
  key: InputSignal<string> = input.required();

  constructor() {
    super(ConsumptionLevelsService);
  }

  ngOnInit(): void {}
}

@Component({
  host: { class: 'table mb-0 border-translucent' },
  selector: 'table[consumptionLevelsTable]',
  template: `
    <thead
      tableHeader
      [columns]="service.columns['ConsumptionLevels']"
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
            [dictionary]="service.dictionary.ConsumptionLevels"
            [(selected)]="item.isSelected"
            (click)="service.onSelect(key(), mode(), item)"
          ></td>

          <td
            class="name align-middle white-space-nowrap px-0 py-0"
          >
            <div class="d-flex align-items-center justify-content-start px-0">
              <a
                [routerLink]="[service.dictionary.ConsumptionLevels.catalogRoute, item.id]"
                [href]="[service.dictionary.ConsumptionLevels.catalogRoute, item.id]"
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
            <div consumptionLevelsTableMenu [item]="item" [key]="key()"></div>
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
    ConsumptionLevelsTableMenuComponent,
  ],
})
export class ConsumptionLevelsTableComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  service = inject(ConsumptionLevelsService);
  icons = inject(IconsService);
  dev = inject(EnvService);

  data = input.required<ConsumptionLevel[]>();
  mode = input.required<CatalogMode>();
  key = input.required<string>();
  view = input.required<View>();

  sortAscending = false;
  devMode = false;
  params!: ConsumptionLevelParams;
  cuid = createId();
  selected = false;
  row: TableRow<ConsumptionLevel> = new TableRow<ConsumptionLevel>(new ConsumptionLevel());

  cells: PartialCellsOf<ConsumptionLevel> = {
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
      this.params = new ConsumptionLevelParams(this.key());
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
