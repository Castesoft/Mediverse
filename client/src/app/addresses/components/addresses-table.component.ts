import { Component, OnInit, Input, inject, input, OnDestroy } from "@angular/core";
import { Addresses, CatalogMode, Column, View } from "src/app/_models/types";
import { IconsService } from "src/app/_services/icons.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";
import { DatePipe, DecimalPipe, NgClass } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { Address, AddressParams } from "src/app/_models/address";
import { Subscription } from "rxjs";
import { GuidService } from "src/app/_services/guid.service";
import { AddressesService } from "src/app/_services/addresses.service";
import { AddressTableCellComponent, } from "src/app/addresses/components/address-table-cell.component";

@Component({
  host: { class: '', },
  selector: 'td[addressTableData]',
  template: `
      <div class="d-flex">
        <a [routerLink]="[]" class="symbol symbol-50px">
          <span class="symbol-label" style="background-image:url({{item() ? item().photoUrl : 'media/misc/image.png'}});"></span>
        </a>
        <div class="ms-5">
          <a [routerLink]="[]" (click)="service.clickLink(type(), item().id, item(), key(), 'detail', view())" class="text-gray-800 text-hover-primary fs-5 fw-bold mb-1">{{ item().name }}</a>
          <div class="text-muted fs-7 fw-bold">{{ item().description }}</div>
        </div>
      </div>
  `,
  standalone: true,
  imports: [ RouterModule, ],
})
export class AddressTableDataComponent {
  service = inject(AddressesService);

  item = input.required<Address>();
  type = input.required<Addresses>();
  key = input.required<string>();
  view = input.required<View>();
}

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable', id: 'kt_table_addresses', },
  selector: 'table[addressesTable]',
  standalone: true,
  templateUrl: './addresses-table.component.html',
  imports: [FontAwesomeModule, TableHeaderComponent, NgClass, FormsModule, RouterModule, DecimalPipe, BsDropdownModule, AddressTableCellComponent, DatePipe,
    MaterialModule, CdkModule, AddressTableDataComponent,
  ],
})
export class AddressesTableComponent implements OnInit, OnDestroy {
  service = inject(AddressesService);
  icons = inject(IconsService);

  @Input() data: Address[] = [];
  key = input.required<string>();
  mode = input.required<CatalogMode>();
  showHeaders = input<boolean>(true);
  type = input.required<Addresses>();
  view = input.required<View>();

  sortAscending = false;
  columns?: Column[];
  devMode = false;
  params!: AddressParams;

  subscriptions: Subscription[] = [];

  cuid: string;
  constructor(guid: GuidService) {
    this.cuid = guid.gen();
  }

  ngOnInit(): void {
    this.columns = this.service.columnDictionary.get(this.type());
    const paramsSubscription = this.service.param$(this.key()).subscribe({ next: params => this.params = params });
    this.subscriptions.push(paramsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
