import { CommonModule } from '@angular/common';
import {
  Component, InputSignal,
  ModelSignal,
  OnDestroy,
  OnInit,
  effect,
  inject,
  input,
  model
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { createId } from '@paralleldrive/cuid2';
import { Subject, takeUntil } from 'rxjs';
import { ControlsModule } from 'src/app/_forms/controls.module';
import { Address } from "src/app/_models/addresses/address";
import {
  CatalogMode,
  ITableMenu,
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
  AddressesService,
} from 'src/app/addresses/addresses.config';
import { AddressParams } from 'src/app/_models/addresses/addressParams';

@Component({
  selector: 'div[addressesTableMenu]',
  host: { class: '' },
  template: `
    <!-- <div class="dropdown-menu d-block" cdkMenu>
      <a
        cdkMenuItem
        class="dropdown-item px-3"
        [href]="service.dictionary['Clinic'].catalogRoute + '/' + item().id"
        (click)="
          service.clickLink(item(), key(), 'detail', 'page');
          $event.preventDefault()
        "
      >
        Ver {{ service.dictionary['Clinic'].singular }}
      </a>
      <a
        cdkMenuItem
        class="dropdown-item px-3"
        [href]="service.dictionary['Clinic'].catalogRoute + '/' + item().id"
        (click)="
          $event.preventDefault();
          service.clickLink(item(), key(), 'detail', 'modal')
        "
      >
        Abrir {{ service.dictionary['Clinic'].singular }} en pantalla modal
      </a>
      <a
        cdkMenuItem
        class="dropdown-item px-3"
        [routerLink]="[service.dictionary['Clinic'].catalogRoute, item().id, 'editar']"
      >
        Editar
      </a>
      <button
        cdkMenuItem
        class="dropdown-item px-3 text-danger"
        (click)="service.delete$(item(), 'Clinic')"
      >
        Eliminar
      </button>
    </div> -->
  `,
  standalone: true,
  imports: [RouterModule, CdkModule, MaterialModule],
})
export class AddressesTableMenuComponent
  extends TableMenu<AddressesService>
  implements OnInit, ITableMenu<Address>
{
  item: ModelSignal<Address> = model.required();
  key: ModelSignal<string> = model.required();

  constructor() {
    super(AddressesService);
  }

  ngOnInit(): void {}
}

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable' },
  selector: 'table[addressesTable]',
  template: `
    <!-- <thead
      tableHeader
      [columns]="service.columns['Clinic']"
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
            [dictionary]="service.dictionary['Clinic']"
            [(selected)]="item.isSelected"
            (click)="service.onSelect(key(), mode(), item)"
          ></td>

          <td
            class="name align-middle white-space-nowrap px-0 py-0"
          >
            <div class="d-flex align-items-center justify-content-start px-0">
              <a
                [routerLink]="[service.dictionary['Clinic'].catalogRoute, item.id]"
                [href]="[service.dictionary['Clinic'].catalogRoute, item.id]"
                class="fw-semibold text-primary"
                >{{ item.name }}</a
              >
            </div>
          </td>

          @for (
            address of row.getItems([
              'street',
              'exteriorNumber',
              'interiorNumber',
              'neighborhood',
              'zipcode',
              'city',
              'state',
              'country',
              'nursesCount',
              'isMain',
            ]);
            let idx = $index;
            track idx
          ) {
            <td
              tableCell
              [item]="address.item"
              [value]="item[address.item.key]"
            ></td>
          }

          <td
            tableMenuCell
            [item]="item"
            [contextMenu]="context_menu"
          ></td>
          <ng-template #context_menu>
            <div addressesTableMenu [item]="item" [key]="key()"></div>
          </ng-template>
        </tr>
      }
    </tbody> -->
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
    AddressesTableMenuComponent,
  ],
})
export class AddressesTableComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  service = inject(AddressesService);
  icons = inject(IconsService);
  dev = inject(EnvService);

  data = input.required<Address[]>();
  mode = model.required<CatalogMode>();
  key = model.required<string>();
  view = model.required<View>();

  sortAscending = false;
  devMode = false;
  params!: AddressParams;
  cuid = createId();
  selected = false;
  row: TableRow<Address> = new TableRow<Address>(new Address());

  constructor() {
    effect(() => {
      this.params = new AddressParams(this.key());
      // this.service.param$(this.key(), this.mode()).subscribe({
      //   next: (params) => {
      //     this.params = params;
      //   },
      // });
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
