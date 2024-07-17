import { Component, OnInit, Input, inject, input, OnDestroy } from "@angular/core";
import { CatalogMode, Role } from "src/app/_models/types";
import { IconsService } from "src/app/_services/icons.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {CdkModule} from "src/app/_shared/cdk.module";
import {MaterialModule} from "src/app/_shared/material.module";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { Product, ProductParams } from "src/app/_models/product";
import { Subscription } from "rxjs";
import { GuidService } from "src/app/_services/guid.service";
import { ProductsService } from "src/app/_services/products.service";
import {ProductTableCellComponent, ProductTableHasAccountCellComponent, ProductTableSexCellComponent} from "src/app/products/components/product-table-cell.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable', id: 'kt_table_products', },
  selector: 'table[productsTable]',
  standalone: true,
  templateUrl: './products-table.component.html',
  imports: [FontAwesomeModule, TableHeaderComponent, NgClass, FormsModule, RouterModule, DecimalPipe, BsDropdownModule, ProductTableCellComponent, DatePipe,
    ProductTableSexCellComponent, ProductTableHasAccountCellComponent, MaterialModule, CdkModule, CurrencyPipe,
  ],
})
export class ProductsTableComponent implements OnInit, OnDestroy {
  service = inject(ProductsService);
  icons = inject(IconsService);

  @Input() data: Product[] = [];
  key = input.required<string>();
  mode = input.required<CatalogMode>();
  showHeaders = input<boolean>(true);

  sortAscending = false;
  columns = this.service.columns;
  devMode = false;
  params!: ProductParams;

  subscriptions: Subscription[] = [];

  cuid: string;
  constructor(guid: GuidService) {
    this.cuid = guid.gen();
  }

  ngOnInit(): void {
    const paramsSubscription = this.service.param$(this.key()).subscribe({ next: params => this.params = params });
    this.subscriptions.push(paramsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
