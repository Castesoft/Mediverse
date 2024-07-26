import { Component, inject, input, OnDestroy, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IconsService } from "src/app/_services/icons.service";
import { Pagination } from "src/app/_models/pagination";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Subject, takeUntil } from "rxjs";
import { DecimalPipe } from "@angular/common";
import { AlertModule } from "ngx-bootstrap/alert";
import { CatalogMode, Role, View } from "src/app/_models/types";
import { Router, RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { FilterForm, Product, ProductParams } from "src/app/_models/product";
import { ControlsModule } from "src/app/_forms/controls.module";
import { TableModule } from "src/app/_shared/table/table.module";
import { CatalogModule } from "src/app/_shared/catalog.module";
import {ProductsFilterMenuComponent} from "src/app/products/components/products-filter-menu.component";
import { ProductsTableComponent } from "src/app/products/components/products-table.component";
import { ProductsService } from "src/app/_services/products.service";
import { LayoutModule } from "src/app/_shared/layout.module";
import { ProductSelectTypeaheadComponent } from "src/app/_shared/components/product-select-typeahead.component";

@Component({
  host: { class: 'pb-6', },
  selector: 'div[productsCatalog]',
  templateUrl: './products-catalog.component.html',
  standalone: true,
  imports: [BsDropdownModule, RouterModule, ReactiveFormsModule, FontAwesomeModule, DecimalPipe,
    ProductsTableComponent, AlertModule, ControlsModule, TableModule, CatalogModule,
    LayoutModule, ProductsFilterMenuComponent, LayoutModule,
  ],
})
export class ProductsCatalogComponent implements OnInit, OnDestroy {
  router = inject(Router);
  service = inject(ProductsService);
  icons = inject(IconsService);

  key = input.required<string>();
  mode = input.required<CatalogMode>();
  view = input.required<View>();

  data?: Product[];
  params!: ProductParams;
  pagination?: Pagination;
  form = new FilterForm();
  loading = true;
  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.params = new ProductParams(this.key());

    this.service.setParam$(this.key(), this.params);

    this.service.param$(this.key())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        this.params = params;
        this.loadData(params);
        this.form.patchValue(params);
      });

    this.form.group.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(this.handleFormValueChange.bind(this));

    this.service.loading$(this.key())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((loading) => (this.loading = loading));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private loadData(params: ProductParams) {
    this.service.loadPagedList(this.key(), params).subscribe({
      next: (response) => {
        const { result, pagination } = response;
        this.data = result;
        this.pagination = pagination;
      },
    });
  }

  private handleFormValueChange = () => {
    const { controls, value } = this.form.group;
    const { dateRange } = controls;

    this.params.updateFromPartial({
      ...value,
      dateFrom: dateRange.value[0],
      dateTo: dateRange.value[1],
    });
  };

  onSubmit() {
    this.service.setParam$(this.key(), this.params);
    this.form.patchValue(this.params);
  }
}
