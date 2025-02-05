import { Component, effect, inject, input, InputSignal, model, ModelSignal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseForm from "src/app/_models/base/components/extensions/baseForm";
import { Order } from "src/app/_models/orders/order";
import { OrderParams } from "src/app/_models/orders/orderParams";
import { OrderFiltersForm } from "src/app/_models/orders/orderFiltersForm";
import { OrderForm } from "src/app/_models/orders/orderForm";
import { FormInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { confirmActionModal, View } from "src/app/_models/base/types";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { OrdersService } from "src/app/orders/orders.config";
import { SymbolCellComponent } from "src/app/_shared/template/components/tables/cells/symbol-cell.component";
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";
import { PhoneNumberPipe } from "src/app/_pipes/phone-number.pipe";
import { OrdersDeliveryStatusBadgeComponent } from "src/app/orders/components/orders-delivery-status-badge.component";
import { OrdersStatusBadgeComponent } from "src/app/orders/components/orders-status-badge.component";
import { firstValueFrom, Observable } from "rxjs";
import { ConfirmService } from "src/app/_services/confirm/confirm.service";
import {
  orderDeliveryStatuses,
  orderStatuses, parseOrderHistoryChangeType,
  parseOrderHistoryProperty
} from "src/app/orders/orders-util";
import { OrderHistory } from "src/app/_models/orders/orderHistory";
import { SelectOption } from "src/app/_models/base/selectOption";
import { OrderAddressCardComponent } from "src/app/orders/components/order-address-card.component";

@Component({
  selector: "[orderForm]",
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ControlsModule,
    Forms2Module,
    SymbolCellComponent,
    PhoneNumberPipe,
    OrdersDeliveryStatusBadgeComponent,
    OrdersStatusBadgeComponent,
    OrderAddressCardComponent
  ]
})
export class OrderFormComponent extends BaseForm<Order, OrderParams, OrderFiltersForm, OrderForm, OrdersService> implements FormInputSignals<Order> {
  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly FormUse: typeof FormUse = FormUse;

  private readonly confirmService: ConfirmService = inject(ConfirmService);

  item: ModelSignal<Order | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  useCard: InputSignal<boolean> = input(true);
  siteSection: InputSignal<SiteSection | undefined> = input();

  orderHistories: OrderHistory[] = [];

  activeTab: string = 'summary';
  onSelectTab: (tab: string) => string = (tab: string) => this.activeTab = tab;

  constructor() {
    super(OrdersService, OrderForm);

    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active());

      if (this.item() !== null) this.form.patchValue(this.item()! as any);

      this.initForm();
      this.setOptions();
      this.retrieveHistory();
    });
  }

  protected readonly parseOrderHistoryProperty = parseOrderHistoryProperty;
  protected readonly parseOrderHistoryChangeType = parseOrderHistoryChangeType;

  private initForm(): void {
    if (this.use() != FormUse.DETAIL) {
      this.form.controls.status.showLabel = false;
      this.form.controls.deliveryStatus.showLabel = false;
    }
  }

  private setOptions(): void {
    this.form.controls.status.selectOptions = orderStatuses;
    this.form.controls.deliveryStatus.selectOptions = orderDeliveryStatuses;
  }

  private retrieveHistory(): void {
    if (this.item() && this.item()?.id) {
      this.service.getHistory(this.item()!.id!).subscribe({
        next: (history) => {
          this.orderHistories = history;
        }
      });
    }
  }

  createSelectOptionFromString(value: string | null): SelectOption | null {
    return value ? new SelectOption({ code: value.toLowerCase(), name: value, id: 0 }) : null;
  }

  async onSubmit(): Promise<void> {
    const authorized: boolean = await firstValueFrom(this.confirmService.confirm(confirmActionModal));
    if (!authorized) return;

    const isNew: boolean = !this.item()?.id;
    const observable: Observable<Order> = isNew
      ? this.service.create(this.form.getRawValue())
      : this.service.update(this.form.getRawValue(), this.item()!.id!, false);

    observable.subscribe({
      next: (order) => {
        console.log(isNew ? 'Created:' : 'Updated:', order)
        this.toastr.success(`Orden ${isNew ? 'creada' : 'actualizada'} exitosamente`);
        this.router.navigate([ 'admin', 'pedidos', order.id ]);
      },
      error: (err) => {
        console.error(`Error ${isNew ? 'creating' : 'updating'} order:`, err)
        this.toastr.error(`Error ${isNew ? 'creando' : 'actualizando'} la orden`);
      }
    });
  }
}
