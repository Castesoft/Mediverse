import { Component, NgModule, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LayoutModule } from "src/app/_shared/layout.module";
import { RouterModule } from "@angular/router";
import { OrdersCatalogComponent } from "src/app/orders/orders-catalog.component";
import { View } from "src/app/_models/types";

@Component({
  selector: 'orders-route',
  template: `
    <router-outlet></router-outlet>`,
})
export class OrdersComponent implements OnInit {
  ngOnInit(): void {

  }
}

@Component({
  selector: 'orders-catalog-route',
  template: `
    <div card>
      <div
        [key]="key"
        [mode]="'view'"
        [view]="view"
        ordersCatalog
      ></div>
    </div>
  `,
  standalone: true,
  imports: [RouterModule, OrdersCatalogComponent, LayoutModule,],
})
export class CatalogComponent implements OnInit {
  mode = 'view';
  key = 'orders';
  view: View = 'page';

  ngOnInit(): void {
  }
}

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Pedidos', data: { breadcrumb: 'Pedidos', },
      component: OrdersComponent, runGuardsAndResolvers: 'always',
      children: [
        {
          path: '',
          component: CatalogComponent,
          title: 'Catálogo de pedidos',
          data: { breadcrumb: 'Catálogo', },
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class OrdersRoutingModule {
}

@NgModule({
  declarations: [
    OrdersComponent,
  ],
  imports: [CommonModule, OrdersRoutingModule, LayoutModule,]
})
export class OrdersModule {
}
