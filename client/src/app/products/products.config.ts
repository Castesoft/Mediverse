import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, ResolveFn, Router, RouterModule, Routes } from "@angular/router";
import { Account } from "src/app/_models/account";
import { CatalogMode, FormUse, Role, Sections, View } from "src/app/_models/types";
import { Product } from "src/app/_models/product";
import { AccountService } from "src/app/_services/account.service";
import { BreadcrumbService } from "src/app/_services/breadcrumb.service";
import { CompactTableService } from "src/app/_services/compact-table.service";
import { GuidService } from "src/app/_services/guid.service";
import { ProductsService } from "src/app/_services/products.service";
import { LayoutModule } from "src/app/_shared/layout.module";
import { ProductsCatalogComponent } from "src/app/products/components/products-catalog.component";
import { ProductDetailComponent, ProductEditComponent, ProductNewComponent } from "src/app/products/views";

@Component({
  selector: 'products-route',
  template: `<router-outlet></router-outlet>`,
})
export class ProductsComponent implements OnInit {
  accountService = inject(AccountService);
  breadcrumbService = inject(BreadcrumbService);

  account: Account | null = null;
  label?: string;

  ngOnInit(): void {
    this.account = this.accountService.current();
    this.breadcrumbService.breadcrumb$.subscribe({
      next: breadcrumb => {
        this.label = breadcrumb;
      }
    });
  }
}

@Component({
  selector: 'products-catalog-route',
  template: `
  <div card>
    <div
      productsCatalog
      [mode]="mode"
      [key]="key"
      [view]="view"

    ></div>
  </div>
  `,
  standalone: true,
  imports: [RouterModule, ProductsCatalogComponent, LayoutModule,],
})
export class CatalogComponent implements OnInit {
  product = inject(ProductsService);
  compact = inject(CompactTableService);
  guid = inject(GuidService);

  isCompact = false;
  view: View = 'page';
  mode: CatalogMode = 'view';
  key = this.guid.gen();
  section: Sections = 'products';
  role: Role = 'Patient';
  label: string;

  constructor() {
    this.label = this.product.dictionary.title;
  }

  ngOnInit(): void {
    this.compact.mode$.subscribe({ next: (mode) => (this.isCompact = mode) });
  }
}

@Component({
  selector: 'product-detail-route',
  template: `
    @if (id && item) {
      <div
        productDetailView
        [id]="id"
        [use]="use"
        [view]="view"
        [item]="item"
        [key]="key"

      ></div>
    }
  `,
  standalone: true,
  imports: [RouterModule, ProductDetailComponent, LayoutModule,],
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item?: Product;
  id?: number;
  use: FormUse = 'detail';
  view: View = 'page';
  label?: string;
  key?: string;
  section: Sections = 'products';
  role: Role = 'Patient';

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.id = +params.get('id')!;
      },
    });
    this.route.data.subscribe({
      next: (data) => {
        this.item = data['item'];
        if (this.item) this.label = this.item.name;
      },
    });
    const navigation = this.router.getCurrentNavigation();
    this.key = navigation?.extras?.state?.['key'];
  }
}
@Component({
  selector: 'product-edit-route',
  template: `
      @if (id && item) {
        <div
          productEditView
          [id]="id"
          [use]="use"
          [view]="view"
          [key]="key"
          [item]="item"
        ></div>
      }
  `,
  standalone: true,
  imports: [ProductEditComponent, RouterModule, LayoutModule,],
})
export class EditComponent implements OnInit {
  private route = inject(ActivatedRoute);

  item?: Product;
  id?: number;
  use: FormUse = 'edit';
  view: View = 'page';
  label?: string;
  key = undefined;
  section: Sections = 'products';
  role: Role = 'Patient';

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.id = +params.get('id')!;
      },
    });
    this.route.data.subscribe({
      next: (data) => {
        this.item = data['item'];
        if (this.item) this.label = this.item.name;
      },
    });
  }
}

@Component({
  selector: 'product-new-route',
  template: `<div productNewView [use]="use" [view]="view"
  ></div>`,
  standalone: true,
  imports: [ProductNewComponent, RouterModule, LayoutModule,],
})
export class NewComponent {
  use: FormUse = 'create';
  view: View = 'page';
  role: Role = 'Patient';
}

export const itemResolver: ResolveFn<Product | null> = (route, state) => {
  const product = inject(ProductsService);
  const id = +route.paramMap.get('id')!;
  return product.getById(id);
};

export const titleDetailResolver: ResolveFn<string> = (route, state) => {
  const product = inject(ProductsService);
  const id = +route.paramMap.get('id')!;
  product.getById(id).subscribe();
  const item = product.getCurrent();
  if (!item) return 'Detalle de producto';
  const title = `Detalle de producto - ${item.name}`;
  return title;
}

export const titleEditResolver: ResolveFn<string> = (route, state) => {
  const product = inject(ProductsService);
  const id = +route.paramMap.get('id')!;
  product.getById(id).subscribe();
  const item = product.getCurrent();
  if (!item) return 'Editar producto';
  const title = `Editar producto - ${item.name}`;
  return title;
}

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Productos', data: { breadcrumb: 'Productos', },
      component: ProductsComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de productos', data: { breadcrumb: 'Catálogo', }, },
        { path: 'create', component: NewComponent, title: 'Crear nuevo producto', data: { breadcrumb: 'Nuevo', }, },
        {
          path: ':id', title: titleDetailResolver, data: { breadcrumb: 'Detalle', },
          component: DetailComponent,
          resolve: { item: itemResolver },
        },
        {
          path: ':id/edit', title: titleEditResolver, data: { breadcrumb: 'Editar', },
          component: EditComponent,
          resolve: { item: itemResolver },
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
  imports: [ CommonModule, ProductsRoutingModule, LayoutModule, ]
})
export class ProductsModule { }
