import { CommonModule } from "@angular/common";
import { Component, inject, model, ModelSignal, OnDestroy, OnInit } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { View, CatalogMode } from "src/app/_models/base/types";
import { BaseCatalog } from "src/app/_models/forms/extensions/baseFormComponent";
import { CatalogInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { Product } from "src/app/_models/products/product";
import { ProductFiltersForm } from "src/app/_models/products/productFiltersForm";
import { ProductParams } from "src/app/_models/products/productParams";
import { IconsService } from "src/app/_services/icons.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TableModule } from "src/app/_shared/table/table.module";
import { ProductsTableComponent } from "src/app/products/components/products-table.component";
import { ProductsService } from "src/app/products/products.config";

@Component({
  host: { class: 'pb-6', },
  selector: 'div[productsCatalog]',
  templateUrl: './products-catalog.component.html',
  standalone: true,
  imports: [
    ProductsTableComponent, CommonModule, MaterialModule, CdkModule, Forms2Module, TableModule, FontAwesomeModule,
  ],
})
export class ProductsCatalogComponent
  extends BaseCatalog<Product, ProductParams, ProductFiltersForm, ProductsService>
  implements OnInit, OnDestroy, CatalogInputSignals<Product, ProductParams>
{
  icons = inject(IconsService);

  item: ModelSignal<Product | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<ProductParams> = model.required();

  constructor() {
    super(ProductsService, ProductFiltersForm);

    this.form
      .setForm(this.params())
      .setValidation(this.validation.active())
    ;

    this.service.createEntry(this.key(), this.params(), this.mode());

    this.service.cache$.subscribe({
      next: cache => {
        this.service.loadPagedList(this.key(), this.params()).subscribe();
      }
    });
  }

  ngOnInit(): void {
    this.service.list$(this.key(), this.mode()).subscribe({ next: list => this.list.set(list) });
    this.service.pagination$(this.key()).subscribe({ next: pagination => this.pagination.set(pagination) });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
