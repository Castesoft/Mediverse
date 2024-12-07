import { CommonModule } from "@angular/common";
import { Component, inject, Injectable, ModelSignal, model, effect, NgModule } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { CatalogMode, View } from "src/app/_models/base/types";
import { BaseForm, BaseDetail, BaseRouteCatalog, BaseRouteDetail, createItemResolver } from "src/app/_models/forms/extensions/baseFormComponent";
import { FormInputSignals, DetailInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { Order } from "src/app/_models/orders/order";
import { orderColumns, orderDictionary } from "src/app/_models/orders/orderConstants";
import { OrderFiltersForm } from "src/app/_models/orders/orderFiltersForm";
import { OrderForm } from "src/app/_models/orders/orderForm";
import { OrderParams } from "src/app/_models/orders/orderParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { CatalogModalType, DetailModalType } from "src/app/_shared/table/table.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { OrdersCatalogComponent } from "src/app/orders/orders-catalog.component";

@Component({
  selector: 'orders-catalog-modal',
  template: `
  @defer {
    <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
    <mat-dialog-content>
    <div
      ordersCatalog
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
  imports: [OrdersCatalogComponent, MaterialModule, CdkModule,],
})
export class OrdersCatalogModalComponent {
  data = inject<CatalogModalType<Order, OrderParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService extends ServiceHelper<Order, OrderParams, OrderFiltersForm> {
  constructor() {
    super(OrderParams, 'orders', orderDictionary, orderColumns);
  }

  showCatalogModal(order: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      OrdersCatalogModalComponent,
      CatalogModalType<Order, OrderParams>
    >(OrdersCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new OrderParams(key),
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
    item: Order | null = null,
    key: string | null = null,
    use: FormUse = 'detail',
    view: View,
    title: string | null = null
  )
  {
  if (view === 'modal') {
    this.matDialog.open<
      OrderDetailModalComponent,
      DetailModalType<Order>
    >(OrderDetailModalComponent, {
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
  selector: "[orderForm]",
  // template: ``,
  templateUrl: './order-form.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ControlsModule, Forms2Module,]
})
export class OrderFormComponent
  extends BaseForm<
    Order, OrderParams, OrderFiltersForm, OrderForm, OrdersService
  >
  implements FormInputSignals<Order> {
  item: ModelSignal<Order | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();

  constructor() {
    super(OrdersService, OrderForm);

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
  selector: 'div[orderDetail]',
  template: `
  <div container3 [type]="'inline'">
    <div detailHeader [(use)]="use" [(view)]="view" [dictionary]="service.dictionary" [id]="$any(item() !== null ? item()!.id : null)" (onDelete)="service.delete$(item()!)"></div>
  </div>
  <div orderForm [(item)]="item" [(key)]="key" [(use)]="use" [(view)]="view"></div>
  `,
  standalone: true,
  imports: [OrderFormComponent, ControlsModule, Forms2Module,],
})
export class OrderDetailComponent
  extends BaseDetail<Order, OrderParams, OrderFiltersForm, OrdersService>
  implements DetailInputSignals<Order>
{
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Order | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();

  constructor() {
    super(OrdersService);
  }

}

@Component({
  selector: 'order-detail-modal',
  template: `
  @defer {
    <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
    <mat-dialog-content>
    <div
      orderDetail
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
  imports: [OrderDetailComponent, ModalWrapperModule, MaterialModule, CdkModule,],
})
export class OrderDetailModalComponent {
  data = inject<DetailModalType<Order>>(MAT_DIALOG_DATA);
}


@Component({
  selector: 'orders-route',
  standalone: false,
  template: `
  <router-outlet></router-outlet>
  `,
})
export class OrdersComponent {}

@Component({
  selector: 'orders-catalog-route',
  template: `
  <div
    ordersCatalog
    [(mode)]="mode"
    [(key)]="key"
    [(view)]="view"
    [(isCompact)]="compact.isCompact"
    [(item)]="item"
    [(params)]="params"
  ></div>
  `,
  standalone: true,
  imports: [RouterModule, OrdersCatalogComponent, ],
})
export class CatalogComponent extends BaseRouteCatalog<Order, OrderParams, OrderFiltersForm, OrdersService> {
  constructor() {
    super(OrdersService, 'orders');

    effect(() => {
      console.log('key', this.key());
    });
  }
}

@Component({
  selector: 'order-detail-route',
  template: `<div orderDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>`,
  standalone: true,
  imports: [RouterModule, OrderDetailComponent,],
})
export class DetailComponent extends BaseRouteDetail<Order> {
  constructor() {
    super('orders', 'detail');

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
  selector: 'order-edit-route',
  template: `<div orderDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>`,
  standalone: true,
  imports: [OrderDetailComponent, RouterModule,],
})
export class EditComponent extends BaseRouteDetail<Order> {
  constructor() {
    super('orders', 'edit');

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
  selector: 'order-new-route',
  template: `<div orderDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>`,
  standalone: true,
  imports: [OrderDetailComponent, RouterModule,],
})
export class NewComponent extends BaseRouteDetail<Order> {
  constructor() {
    super('orders', 'create');

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
      component: OrdersComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de ganaderías', data: { breadcrumb: 'Catálogo', }, },
        { path: 'nuevo', component: NewComponent, title: 'Crear nueva ganadería', data: { breadcrumb: 'Nuevo', }, },
        {
          path: ':id', data: { breadcrumb: 'Detalle', },
          component: DetailComponent,
          resolve: { item: createItemResolver(OrdersService) },
        },
        {
          path: ':id/editar', data: { breadcrumb: 'Editar', },
          component: EditComponent,
          resolve: { item: createItemResolver(OrdersService) },
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }

@NgModule({
  declarations: [
    OrdersComponent,
  ],
  imports: [ CommonModule, OrdersRoutingModule, ]
})
export class OrdersModule { }

