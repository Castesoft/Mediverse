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
  orderStatuses,
  parseOrderHistoryChangeType,
  parseOrderHistoryProperty
} from "src/app/orders/orders-util";
import { OrderHistory } from "src/app/_models/orders/orderHistory";
import { SelectOption } from "src/app/_models/base/selectOption";
import { OrderAddressCardComponent } from "src/app/orders/components/order-address-card.component";
import { PaymentMethodCellComponent } from "src/app/payments/components/payment-method-cell.component";
import {
  OrderProductsTableComponent
} from "src/app/orders/components/order-products-table/order-products-table.component";
import { Patient } from "src/app/_models/patients/patient";
import { RedirectWarningData } from "src/app/_shared/components/redirect-warning-modal/redirectWarningData";
import {
  RedirectWarningModalComponent
} from "src/app/_shared/components/redirect-warning-modal/redirect-warning-modal.component";
import { PaymentNavigationService } from "src/app/payments/payment-navigation.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "[orderForm]",
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
  imports: [
    CommonModule,
    RouterModule,
    ControlsModule,
    Forms2Module,
    SymbolCellComponent,
    PhoneNumberPipe,
    OrdersDeliveryStatusBadgeComponent,
    OrdersStatusBadgeComponent,
    OrderAddressCardComponent,
    PaymentMethodCellComponent,
    OrderProductsTableComponent
  ]
})
export class OrderFormComponent extends BaseForm<Order, OrderParams, OrderFiltersForm, OrderForm, OrdersService> implements FormInputSignals<Order> {
  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly FormUse: typeof FormUse = FormUse;

  private readonly paymentNavigationService: PaymentNavigationService = inject(PaymentNavigationService);
  private readonly confirmService: ConfirmService = inject(ConfirmService);
  private readonly matDialog: MatDialog = inject(MatDialog);

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

  override async onSubmit(): Promise<void> {
    const authorized: boolean = await firstValueFrom(this.confirmService.confirm(confirmActionModal));
    if (!authorized) return;

    const isNew: boolean = !this.item()?.id;
    const observable: Observable<Order> = isNew
      ? this.service.create(this.form, this.view(), { use: this.use(), value: this.form.getRawValue(), })
      : this.service.update(this.form, this.view(), {
        use: this.use(),
        value: this.form.getRawValue(),
        id: this.form.controls.id.value ?? undefined,
      });

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

  /**
   * Opens a redirect warning modal before navigating to the checkout.
   * If the user confirms, it navigates to the checkout page,
   * passing the current URL as the cancelUrl so the user can go back.
   */
  navigateToCheckout(): void {
    const order: Order | null = this.item();
    const patient: Patient | undefined = order?.patient;
    if (!order?.id || !patient?.id) {
      console.error('Missing order or patient details for checkout.');
      return;
    }

    const dialogData: RedirectWarningData = {
      message: 'Se te redirigirá a la ventana de pago. ¿Deseas continuar?'
    };

    this.matDialog.open(RedirectWarningModalComponent, { data: dialogData })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.paymentNavigationService.navigateToCheckout(order.id!, patient.id!, 'receta', this.router.url)
            .catch((err: any) => console.error('Navigation error:', err));
        }
      });
  }
}
