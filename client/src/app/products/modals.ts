import { Component, inject, OnInit, viewChild } from "@angular/core";
import { CatalogMode, FormUse, Role, View } from "src/app/_models/types";
import { Product } from "src/app/_models/product";
import { ProductsService } from "src/app/_services/products.service";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ProductsCatalogComponent } from "src/app/products/components/products-catalog.component";
import { ProductsFilterFormComponent } from "src/app/products/components/products-filter-form.component";
import { ProductDetailComponent, ProductEditComponent, ProductNewComponent } from "src/app/products/views";

@Component({
  selector: 'product-edit-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div
          productEditView
          [id]="id"
          [use]="use"
          [view]="'modal'"
          [key]="undefined"
          [item]="item"

        ></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ProductEditComponent, ModalWrapperModule],
})
export class ProductEditModalComponent {
  id!: number;
  use!: FormUse;
  title?: string;
  item!: Product;

}

@Component({
  selector: 'product-edit-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div
          productDetailView
          [id]="id"
          [use]="use"
          [view]="'modal'"
          [key]="key"
          [item]="item"

        ></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ProductDetailComponent, ModalWrapperModule],
})
export class ProductDetailModalComponent {
  id!: number;
  use!: FormUse;
  title?: string;
  key!: string;
  item!: Product;

}

@Component({
  selector: 'product-new-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div productNewView [use]="use" [view]="'modal'" ></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ProductNewComponent, ModalWrapperModule],
})
export class ProductNewModalComponent {
  use!: FormUse;
  title?: string;

}

@Component({
  selector: 'products-filter-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div productsFilterForm [key]="key" [formId]="formId" ></div>
      </div>
      <div
        modalFooterFilters
        [formId]="formId"
        (onReset)="onReset()"
        (onSubmit)="onSubmit()"
      ></div>
    </div>
  `,
  standalone: true,
  imports: [ProductsFilterFormComponent, ModalWrapperModule],
})
export class ProductsFilterModalComponent implements OnInit {
  product = inject(ProductsService);

  formId!: string;
  key!: string;

  title?: string;

  form = viewChild.required(ProductsFilterFormComponent);

  onReset = () =>
    this.form()!.product.resetForm(this.key, this.form()!.form);
  onSubmit = () => this.form()!.onSubmit();

  ngOnInit(): void {
    this.formId = this.form().form.id;
  }
}

@Component({
  selector: 'products-catalog-modal',
  template: `
    @defer {
      <div modalContent>
        @if (title) {
          <div modalHeader [title]="title"></div>
        }
        <div modalBody>
          <div
            productsCatalog
            class="modal-body py-3 px-4"
            [mode]="mode"
            [key]="key"
            [view]="view"
          ></div>
        </div>
      </div>
    }
  `,
  standalone: true,
  imports: [ProductsCatalogComponent, ModalWrapperModule],
})
export class ProductsCatalogModalComponent {
  key!: string;

  isCompact = true;
  mode!: CatalogMode;
  view: View = 'modal';
  title?: string;
}
