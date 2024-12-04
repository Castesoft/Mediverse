import { Component, inject, model, OnDestroy, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IconsService } from "src/app/_services/icons.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Subject, takeUntil } from "rxjs";
import { DecimalPipe } from "@angular/common";
import { AlertModule } from "ngx-bootstrap/alert";
import { CatalogMode, View } from "src/app/_models/types";
import { Router, RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { Order, OrderParams } from "src/app/_models/order";
import { ControlsModule } from "src/app/_forms/controls.module";
import { TableModule } from "src/app/_shared/table/table.module";
import { CatalogModule } from "src/app/_shared/catalog.module";
import { OrdersTableComponent } from "src/app/orders/orders-table.component";
import { OrdersService } from "src/app/_services/orders.service";
import { LayoutModule } from "src/app/_shared/layout.module";
import { ProductsFilterMenuComponent } from "src/app/products/components/products-filter-menu.component";
import { ProductsTableComponent } from "src/app/products/components/products-table.component";

@Component({
  host: { class: 'pb-6', },
  selector: 'div[ordersCatalog]',
  templateUrl: './orders-catalog.component.html',
  standalone: true,
  imports: [BsDropdownModule, RouterModule, ReactiveFormsModule, FontAwesomeModule, DecimalPipe, AlertModule, ControlsModule, TableModule, CatalogModule,
    LayoutModule, LayoutModule, OrdersTableComponent, ProductsFilterMenuComponent, ProductsTableComponent, OrdersTableComponent
  ],
})
export class OrdersCatalogComponent implements OnInit, OnDestroy {
  router = inject(Router);
  service = inject(OrdersService);
  icons = inject(IconsService);

  key = model.required<string>();
  mode = model.required<CatalogMode>();
  view = model.required<View>();

  data?: Order[];
  params!: OrderParams;
  pagination?: Pagination;
  loading = true;
  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.params = new OrderParams(this.key());

    this.service.setParam$(this.key(), this.params);

    this.service.param$(this.key())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        this.params = params;
        this.loadData(params);
      });

    this.service.loading$(this.key())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((loading) => (this.loading = loading));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private loadData(params: OrderParams) {
    this.service.loadPagedList(this.key(), params).subscribe({
      next: (response) => {
        const { result, pagination } = response;
        console.log(result);
        this.data = result;
        this.pagination = pagination;
      },
    });
  }
}
