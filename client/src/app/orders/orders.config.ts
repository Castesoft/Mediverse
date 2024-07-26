import { Component, inject, NgModule, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LayoutModule } from "src/app/_shared/layout.module";
import { ActivatedRoute, ResolveFn, Router, RouterModule } from "@angular/router";
import { OrdersCatalogComponent } from "src/app/orders/orders-catalog.component";
import { FormUse, Role, View } from "src/app/_models/types";
import { OrdersService } from "src/app/_services/orders.service";
import { OrderDetailComponent } from "src/app/orders/order-detail.component";
import { createId } from "@paralleldrive/cuid2";
import { Order } from "src/app/_models/order";
import { Subject, takeUntil } from "rxjs";

export const titleDetailResolver: ResolveFn<string> = (route, state) => {
  const service = inject(OrdersService);
  service.getById(+route.paramMap.get('id')!).subscribe();
  const order = service.getCurrent();
  if (!order) return 'Detalle de pedido';
  return `Detalle de pedido - #${order.id}`;
}

export const itemResolver: ResolveFn<Order | null> = (route, state) => {
  const service = inject(OrdersService);
  const id = +route.paramMap.get('id')!;
  return service.getById(id);
};

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


@Component({
  selector: 'order-detail-route',
  template: `
    @if (id && item && key) {
      <div
        orderDetailView
        [id]="id"
        [use]="use"
        [view]="view"
        [item]="item"
        [key]="key"
      ></div>
    }
  `,
  standalone: true,
  imports: [RouterModule, OrderDetailComponent, LayoutModule,],
})
export class DetailComponent implements OnInit, OnDestroy {
  private ordersService = inject(OrdersService);
  private ngUnsubscribe = new Subject<void>();
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item?: Order;
  id?: number;
  use: FormUse = 'detail';
  view: View = 'page';
  label?: string;
  key?: string;
  role: Role = 'Patient';

  ngOnInit(): void {
    this.subscribeToParamMap();
    this.subscribeToRouteData();
    this.key = this.router.getCurrentNavigation()?.extras?.state?.['key'] || createId();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private subscribeToParamMap = () => {
    this.route.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (params) => {
        this.id = +params.get('id')!;
        this.ordersService.getById(this.id).subscribe({
          next: (item) => {
            this.item = item;
            this.label = item.patient?.fullName;
          },
        });
      },
    });
  }

  private subscribeToRouteData = () => {
    this.route.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (data) => {
        this.item = data['item'];
        if (this.item) this.label = this.item.patient?.fullName;
      },
    });
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
        {
          path: ':id', title: titleDetailResolver, data: { breadcrumb: 'Detalle', },
          component: DetailComponent,
          resolve: { item: itemResolver },
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
