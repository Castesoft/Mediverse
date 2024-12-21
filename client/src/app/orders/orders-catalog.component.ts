import { CommonModule } from "@angular/common";
import { Component, OnDestroy, ModelSignal, model, effect } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseCatalog from "src/app/_models/base/components/extensions/baseCatalog";
import { View, CatalogMode } from "src/app/_models/base/types";
import { CatalogInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { Order } from "src/app/_models/orders/order";
import { OrderFiltersForm } from "src/app/_models/orders/orderFiltersForm";
import { OrderParams } from "src/app/_models/orders/orderParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "../_shared/template/components/tables/tables.module";
import { OrdersTableComponent } from "src/app/orders/orders-table.component";
import { OrdersService } from "src/app/orders/orders.config";

@Component({
  selector: '[ordersCatalog]',
  // template: ``,
  templateUrl: './orders-catalog.component.html',
  standalone: true,
  imports: [ FontAwesomeModule,
    OrdersTableComponent, CommonModule,
    RouterModule, ControlsModule, TablesModule,
    CdkModule, MaterialModule, Forms2Module,
   ],
})
export class OrdersCatalogComponent
  extends BaseCatalog<Order, OrderParams, OrderFiltersForm, OrdersService>
  implements OnDestroy, CatalogInputSignals<Order, OrderParams>
{
  item: ModelSignal<Order | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<OrderParams> = model.required();


  constructor() {
    super(OrdersService, OrderFiltersForm);

    effect(() => {
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
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
