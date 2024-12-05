import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy, inject, input, model, effect } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { createId } from "@paralleldrive/cuid2";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { Subject } from "rxjs";
import { CatalogMode, View } from "src/app/_models/base/types";
import { Product } from "src/app/_models/products/product";
import { productCells } from "src/app/_models/products/productConstants";
import { ProductParams } from "src/app/_models/products/productParams";
import { PartialCellsOf } from "src/app/_models/tables/tableCellItem";
import { TableRow } from "src/app/_models/tables/tableRow";
import { DevService } from "src/app/_services/dev.service";
import { IconsService } from "src/app/_services/icons.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";
import { ProductTableCellComponent, ProductTableSexCellComponent, ProductTableHasAccountCellComponent } from "src/app/products/components/product-table-cell.component";
import { ProductsService } from "src/app/products/products.config";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable', id: 'kt_table_products', },
  selector: 'table[productsTable]',
  standalone: true,
  templateUrl: './products-table.component.html',
  imports: [FontAwesomeModule, TableHeaderComponent, CommonModule, FormsModule, RouterModule, BsDropdownModule, ProductTableCellComponent,
    ProductTableSexCellComponent, ProductTableHasAccountCellComponent, MaterialModule, CdkModule,
  ],
})
export class ProductsTableComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  service = inject(ProductsService);
  icons = inject(IconsService);
  dev = inject(DevService);

  data = input.required<Product[]>();
  isCompact = model.required<boolean>();
  mode = model.required<CatalogMode>();
  key = model.required<string | null>();
  view = model.required<View>();

  sortAscending = false;
  params!: ProductParams;
  cuid = createId();
  selected = false;
  row: TableRow<Product> = new TableRow<Product>(new Product());

  cells: PartialCellsOf<Product> = productCells;

  constructor() {
    effect(() => {
      this.params = new ProductParams(this.key());
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
