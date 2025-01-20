import { Component, effect, input, InputSignal, model, ModelSignal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseForm from "src/app/_models/base/components/extensions/baseForm";
import { Product } from "src/app/_models/products/product";
import { ProductParams } from "src/app/_models/products/productParams";
import { ProductFiltersForm } from "src/app/_models/products/productFiltersForm";
import { ProductForm } from "src/app/_models/products/productForm";
import { FormInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { View } from "src/app/_models/base/types";
import { ProductsService } from "src/app/products/products.config";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { SymbolCellComponent } from "src/app/_shared/template/components/tables/cells/symbol-cell.component";
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";

@Component({
  selector: "[productForm]",
  templateUrl: './product-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ControlsModule,
    Forms2Module,
    SymbolCellComponent,
  ]
})
export class ProductFormComponent extends BaseForm<Product, ProductParams, ProductFiltersForm, ProductForm, ProductsService> implements FormInputSignals<Product> {
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;

  item: ModelSignal<Product | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  useCard: InputSignal<boolean> = input(true);
  siteSection: InputSignal<SiteSection | undefined> = input();

  constructor() {
    super(ProductsService, ProductForm);

    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active());

      if (this.item() !== null) this.form.patchValue(this.item()!);
    });
  }
}
