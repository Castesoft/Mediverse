import { Component, effect, inject, input, model, OnDestroy, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IconsService } from "src/app/_services/icons.service";
import { Pagination } from "src/app/_models/pagination";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Subject } from "rxjs";
import { CommonModule, DecimalPipe } from "@angular/common";
import { AlertModule } from "ngx-bootstrap/alert";
import { CatalogMode, View } from "src/app/_models/types";
import { Router, RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { Product, ProductParams, ProductsFilterForm } from "src/app/_models/product";
import { ControlsModule } from "src/app/_forms/controls.module";
import { TableModule } from "src/app/_shared/table/table.module";
import { CatalogModule } from "src/app/_shared/catalog.module";
import { ProductsFilterMenuComponent } from "src/app/products/components/products-filter-menu.component";
import { ProductsTableComponent } from "src/app/products/components/products-table.component";
import { ProductsService } from "src/app/_services/products.service";
import { LayoutModule } from "src/app/_shared/layout.module";
import { createId } from "@paralleldrive/cuid2";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ProductsFilterFormComponent } from "src/app/products/components/products-filter-form.component";

@Component({
  host: { class: 'pb-6', },
  selector: 'div[productsCatalog]',
  templateUrl: './products-catalog.component.html',
  standalone: true,
  imports: [BsDropdownModule, RouterModule, ReactiveFormsModule, FontAwesomeModule, DecimalPipe,
    ProductsTableComponent, AlertModule, ControlsModule, TableModule, CatalogModule,
    LayoutModule, ProductsFilterMenuComponent, LayoutModule, CommonModule, CdkModule, MaterialModule,
    ProductsFilterFormComponent,
  ],
})
export class ProductsCatalogComponent implements OnInit, OnDestroy {
  router = inject(Router);
  service = inject(ProductsService);
  icons = inject(IconsService);

  key = model.required<string>();
  mode = model.required<CatalogMode>();
  view = model.required<View>();

  pagination?: Pagination;
  form = new ProductsFilterForm();
  private ngUnsubscribe = new Subject<void>();

  toggle = model(false);

  params!: ProductParams;
  formId = `${this.router.url}#form-${createId()}`;
  loading = true;
  list?: Product[];

  constructor() {
    effect(() => {
      this.params = new ProductParams(this.key());
      this.service.createEntry(this.key(), this.params, this.mode());

      this.service.cache$.subscribe({ next: cache => {
        this.service.loadPagedList(this.key(), this.params).subscribe();
      }});
    })
  }

  ngOnInit(): void {
    this.service.param$(this.key(), this.mode()).subscribe({ next: params => this.params = params });
    this.service.list$(this.key(), this.mode()).subscribe({ next: list => this.list = list });
    this.service.pagination$(this.key()).subscribe({ next: pagination => this.pagination = pagination });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
