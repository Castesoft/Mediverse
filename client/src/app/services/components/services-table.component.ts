import { CommonModule } from "@angular/common";
import { Component, OnInit, ModelSignal, model, OnDestroy, inject, input, effect } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { createId } from "@paralleldrive/cuid2";
import { Subject } from "rxjs";
import { ControlsModule } from "src/app/_forms/controls.module";
import { CatalogMode, View } from "src/app/_models/base/types";
import { Service } from "src/app/_models/services/service";
import { serviceCells } from "src/app/_models/services/serviceConstants";
import { ServiceParams } from "src/app/_models/services/serviceParams";
import { TableMenu } from "src/app/_models/tables/extensions/tableComponentExtensions";
import { ITableMenu } from "src/app/_models/tables/interfaces/tableComponentInterfaces";
import { PartialCellsOf, TableCellItem } from "src/app/_models/tables/tableCellItem";
import { TableRow } from "src/app/_models/tables/tableRow";
import { DevService } from "src/app/_services/dev.service";
import { IconsService } from "src/app/_services/icons.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TableModule } from "src/app/_shared/table/table.module";
import { ServicesService } from "src/app/services/services.config";

@Component({
  selector: 'div[servicesTableMenu]',
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
export class ServicesTableMenuComponent
  extends TableMenu<ServicesService>
  implements OnInit, ITableMenu<Service>
{
  item: ModelSignal<Service> = model.required();
  key: ModelSignal<string | null> = model.required();

  constructor() {
    super(ServicesService);
  }

  ngOnInit(): void {}
}

@Component({
  host: { class: 'table fs-9 mb-0 border-translucent' },
  selector: 'table[servicesTable]',
  template: `
    <thead
      tableHeader
      [columns]="service.columns"
      [params]="params"
      (onParamsChange)="service.onSortOptionsChange(key(), $any($event))"
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
            [(dictionary)]="service.dictionary"
            [(selected)]="item.isSelected"
            (click)="service.onSelect(key(), mode(), item)"
          ></td>

          <td
            class="name align-middle white-space-nowrap px-0 py-0"
            [ngStyle]="isCompact() ? {} : { cursor: 'pointer' }"
          >
            <div class="d-flex align-items-center justify-content-start px-0">
              <a
                [routerLink]="[service.dictionary.catalogRoute, item.id]"
                [href]="[service.dictionary.catalogRoute, item.id]"
                class="fw-semibold text-primary"
                >#{{ item.id | number }}</a
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
              [(isCompact)]="isCompact"
              [value]="item[cell.item.key]"
            ></td>
          }

          <td
            tableMenuCell
            [item]="item"
            [contextMenu]="context_menu"
            [(isCompact)]="isCompact"
          ></td>
          <ng-template #context_menu>
            <div servicesTableMenu [item]="item" [key]="key()"></div>
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
    ServicesTableMenuComponent,
  ],
})
export class ServicesTableComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  service = inject(ServicesService);
  icons = inject(IconsService);
  dev = inject(DevService);

  data = input.required<Service[]>();
  mode = model.required<CatalogMode>();
  key = model.required<string | null>();
  view = model.required<View>();
  isCompact = model.required<boolean>();

  sortAscending = false;
  params!: ServiceParams;
  cuid = createId();
  selected = false;
  row: TableRow<Service> = new TableRow<Service>(new Service());

  cells: PartialCellsOf<Service> = serviceCells;

  constructor() {
    effect(() => {
      this.params = new ServiceParams(this.key());
      this.service.param$(this.key(), this.mode()).subscribe({
        next: (params) => {
          this.params = params;
        },
      });
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
