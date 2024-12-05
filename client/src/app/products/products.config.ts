import { CommonModule } from "@angular/common";
import { Component, inject, Injectable, ModelSignal, model, effect, NgModule } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { CatalogMode, View } from "src/app/_models/base/types";
import { BaseForm, BaseDetail, BaseRouteCatalog, BaseRouteDetail, createItemResolver } from "src/app/_models/forms/extensions/baseFormComponent";
import { FormInputSignals, DetailInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { FormUse } from "src/app/_models/forms/formTypes";
import { Product } from "src/app/_models/products/product";
import { productDictionary, productColumns } from "src/app/_models/products/productConstants";
import { ProductFiltersForm } from "src/app/_models/products/productFiltersForm";
import { ProductForm } from "src/app/_models/products/productForm";
import { ProductParams } from "src/app/_models/products/productParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { CatalogModalType, DetailModalType } from "src/app/_shared/table/table.module";
import { BreadcrumbsModule } from "src/app/_utils/breadcrumbs.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { ProductsCatalogComponent } from "src/app/products/components/products-catalog.component";

@Component({
  selector: 'products-catalog-modal',
  template: `
  @defer {
    <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
    <mat-dialog-content>
    <div
      productsCatalog
      [(mode)]="data.mode"
      [(key)]="data.key"
      [(view)]="data.view"
      [(isCompact)]="data.isCompact"
      [(item)]="data.item"
      [(params)]="data.params"
    ></div>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button mat-dialog-close>Cerrar</button>
  </mat-dialog-actions>
}
`,
  standalone: true,
  imports: [ProductsCatalogComponent, MaterialModule, CdkModule,],
})
export class ProductsCatalogModalComponent {
  data = inject<CatalogModalType<Product, ProductParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends ServiceHelper<Product, ProductParams, FormGroup2<ProductParams>> {
  constructor() {
    super(ProductParams, 'products', productDictionary, productColumns);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      ProductsCatalogModalComponent,
      CatalogModalType<Product, ProductParams>
    >(ProductsCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new ProductParams(key),
        view: view,
        title: this.dictionary.title,
        item: null,
      },
      disableClose: true,
      hasBackdrop: false,
      panelClass: [ "window" ]
    });
  };

  clickLink(
    item: Product | null = null,
    key: string | null = null,
    use: FormUse = 'detail',
    view: View,
    title: string | null = null
  )
  {
  if (view === 'modal') {
    this.matDialog.open<
      ProductDetailModalComponent,
      DetailModalType<Product>
    >(ProductDetailModalComponent, {
      data: {
        item: item,
        key: key,
        use: use,
        view: 'modal',
        title: this.getFormHeaderText(use, item),
      },
      disableClose: true,
      hasBackdrop: false,
      panelClass: [ 'window' ]
    });

  } else {
    switch (use) {
      case 'create':
        this.router.navigate([this.dictionary.createRoute]);
        break;
      case 'edit':
        this.router.navigate([`${this.dictionary.catalogRoute}/${item?.id}/editar`]);
        break;
      case 'detail':
        this.router.navigate([`${this.dictionary.catalogRoute}/${item?.id}`]);
        break;
      }
    }
  }
}

@Component({
  selector: "[productForm]",
  // template: ``,
  templateUrl: './product-form.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ControlsModule, Forms2Module,]
})
export class ProductFormComponent
  extends BaseForm<
    Product, ProductParams, ProductFiltersForm, ProductForm, ProductsService
  >
  implements FormInputSignals<Product> {
  item: ModelSignal<Product | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();

  constructor() {
    super(ProductsService, ProductForm);

    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active());

      const value = this.item();

      if (value !== null) {
        this.form.patchValue(value);
      }
    });
  }
}

@Component({
  selector: 'div[productDetail]',
  template: `
  <div container3 [type]="'inline'">
    <div detailHeader [(use)]="use" [(view)]="view" [dictionary]="service.dictionary" [id]="$any(item() !== null ? item()!.id : null)" (onDelete)="service.delete$(item()!)"></div>
  </div>
  <div productForm [(item)]="item" [(key)]="key" [(use)]="use" [(view)]="view"></div>
  `,
  standalone: true,
  imports: [ProductFormComponent, ControlsModule, Forms2Module,],
})
export class ProductDetailComponent
  extends BaseDetail<Product, ProductParams, ProductFiltersForm, ProductsService>
  implements DetailInputSignals<Product>
{
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Product | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();

  constructor() {
    super(ProductsService);
  }

}

@Component({
  selector: 'product-detail-modal',
  template: `
  @defer {
    <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
    <mat-dialog-content>
    <div
      productDetail
      [(use)]="data.use"
      [(view)]="data.view"
      [(key)]="data.key"
      [(item)]="data.item"
      [(title)]="data.title"
    ></div>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button mat-dialog-close>Cerrar</button>
  </mat-dialog-actions>
}
`,
  standalone: true,
  imports: [ProductDetailComponent, ModalWrapperModule, MaterialModule, CdkModule,],
})
export class ProductDetailModalComponent {
  data = inject<DetailModalType<Product>>(MAT_DIALOG_DATA);
}


@Component({
  selector: 'products-route',
  standalone: false,
  template: `
  <router-outlet></router-outlet>
  `,
})
export class ProductsComponent {}

@Component({
  selector: 'products-catalog-route',
  template: `
  <div
    productsCatalog
    [(mode)]="mode"
    [(key)]="key"
    [(view)]="view"
    [(isCompact)]="compact.isCompact"
    [(item)]="item"
    [(params)]="params"
  ></div>
  `,
  standalone: true,
  imports: [RouterModule, ProductsCatalogComponent, BreadcrumbsModule, ],
})
export class CatalogComponent extends BaseRouteCatalog<Product, ProductParams, ProductFiltersForm, ProductsService> {
  constructor() {
    super(ProductsService, 'products');

    effect(() => {
      console.log('key', this.key());
    });
  }
}

@Component({
  selector: 'product-detail-route',
  template: `<div productDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>`,
  standalone: true,
  imports: [RouterModule, ProductDetailComponent, BreadcrumbsModule,],
})
export class DetailComponent extends BaseRouteDetail<Product> {
  constructor() {
    super('products', 'detail');

    effect(() => {
      this.route.paramMap.subscribe({
        next: params => {
          if (params.has('id')) {
            this.id.set(+params.get('id')!);
          }
        },
      });
      this.route.data.subscribe({
        next: (data) => {
          this.item.set(data['item']);
        },
      });
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}

@Component({
  selector: 'product-edit-route',
  template: `<div productDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>`,
  standalone: true,
  imports: [ProductDetailComponent, RouterModule, BreadcrumbsModule,],
})
export class EditComponent extends BaseRouteDetail<Product> {
  constructor() {
    super('products', 'edit');

    effect(() => {
      this.route.paramMap.subscribe({
        next: params => {
          if (params.has('id')) {
            this.id.set(+params.get('id')!);
          }
        },
      });
      this.route.data.subscribe({
        next: (data) => {
          this.item.set(data['item']);
        },
      });
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}

@Component({
  selector: 'product-new-route',
  template: `<div productDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>`,
  standalone: true,
  imports: [ProductDetailComponent, RouterModule, BreadcrumbsModule,],
})
export class NewComponent extends BaseRouteDetail<Product> {
  constructor() {
    super('products', 'create');

    effect(() => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Ganaderías', data: { breadcrumb: 'Ganaderías', },
      component: ProductsComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de ganaderías', data: { breadcrumb: 'Catálogo', }, },
        { path: 'nuevo', component: NewComponent, title: 'Crear nueva ganadería', data: { breadcrumb: 'Nuevo', }, },
        {
          path: ':id', data: { breadcrumb: 'Detalle', },
          component: DetailComponent,
          resolve: { item: createItemResolver(ProductsService) },
        },
        {
          path: ':id/editar', data: { breadcrumb: 'Editar', },
          component: EditComponent,
          resolve: { item: createItemResolver(ProductsService) },
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }

@NgModule({
  declarations: [
    ProductsComponent,
  ],
  imports: [ CommonModule, ProductsRoutingModule, ]
})
export class ProductsModule { }
