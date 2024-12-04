import { CommonModule } from "@angular/common";
import { NgModule, signal } from "@angular/core";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, ResolveFn, Router, RouterModule, Routes } from "@angular/router";
import { Account } from "src/app/_models/account";
import { CatalogMode, FormUse, Role, Sections, View } from "src/app/_models/types";
import { Product } from "src/app/_models/product";
import { AccountService } from "src/app/_services/account.service";
import { BreadcrumbService } from "src/app/_services/breadcrumb.service";
import { CompactTableService } from "src/app/_services/compact-table.service";
import { ProductsService } from "src/app/_services/products.service";
import { LayoutModule } from "src/app/_shared/layout.module";
import { ProductsCatalogComponent } from "src/app/products/components/products-catalog.component";
import { ProductDetailComponent } from "src/app/products/views";
import { createId } from "@paralleldrive/cuid2";

@Component({
  selector: 'products-route',
  template: `<router-outlet></router-outlet>`,
  standalone: false,
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

  isCompact = false;
  view: View = 'page';
  mode: CatalogMode = 'view';
  key = createId();
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
      <div productDetailForm [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key"></div>
  `,
  standalone: true,
  imports: [RouterModule, ProductDetailComponent, LayoutModule,],
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  section: Sections = 'products';
  role: Role = 'Patient';

  item = signal<Product | null>(null);
  use = signal<FormUse>('detail');
  view = signal<View>('page');
  key = signal<string | null>(null);

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.item.set(data['item']);
      },
    });
    const navigation = this.router.getCurrentNavigation();
    this.key.set(navigation?.extras?.state?.['key']);
  }
}
@Component({
  selector: 'product-edit-route',
  template: `
  <div productDetailForm [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key"></div>
  `,
  standalone: true,
  imports: [ProductDetailComponent, RouterModule, LayoutModule,],
})
export class EditComponent implements OnInit {
  private route = inject(ActivatedRoute);

  section: Sections = 'products';
  role: Role = 'Patient';

  item = signal<Product | null>(null);
  use = signal<FormUse>('edit');
  view = signal<View>('page');
  key = signal<string | null>(null);

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.item.set(data['item']);
      },
    });
  }
}

@Component({
  selector: 'product-new-route',
  template: `
  <div productDetailForm [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key"></div>
  `,
  standalone: true,
  imports: [ProductDetailComponent, RouterModule, LayoutModule,],
})
export class NewComponent {
  item = signal<Product | null>(null);
  use = signal<FormUse>('create');
  view = signal<View>('page');
  key = signal<string | null>(null);
}

export const itemResolver: ResolveFn<Product | null> = (route, state) => {
  const product = inject(ProductsService);
  const id = +route.paramMap.get('id')!;
  return product.getById(id);
};

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Productos', data: { breadcrumb: 'Productos', },
      component: ProductsComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de productos', data: { breadcrumb: 'Catálogo', }, },
        { path: 'create', component: NewComponent, title: 'Crear nuevo producto', data: { breadcrumb: 'Nuevo', }, },
        {
          path: ':id', data: { breadcrumb: 'Detalle', },
          component: DetailComponent,
          resolve: { item: itemResolver },
        },
        {
          path: ':id/edit', data: { breadcrumb: 'Editar', },
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
