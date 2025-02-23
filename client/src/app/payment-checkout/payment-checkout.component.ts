import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import {
  RedirectWarningModalComponent
} from "src/app/_shared/components/redirect-warning-modal/redirect-warning-modal.component";
import { RedirectWarningData } from "src/app/_shared/components/redirect-warning-modal/redirectWarningData";
import { CurrencyPipe } from "@angular/common";
import { PaymentMethod } from "src/app/_models/paymentMethod/paymentMethod";
import { EventsService } from "src/app/events/events.config";
import Event from "src/app/_models/events/event";
import { Address } from "src/app/_models/addresses/address";
import { PaymentCheckoutService } from "src/app/payment-checkout/payment-checkout.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import {
  CheckoutAddressEntryCardComponent
} from "src/app/payment-checkout/components/checkout-address-entry-card/checkout-address-entry-card.component";
import {
  CheckoutPaymentMethodEntryCardComponent
} from "src/app/payment-checkout/components/checkout-payment-method-entry-card/checkout-payment-method-entry-card.component";
import { ToastrService } from "ngx-toastr";
import { StripePaymentGatewayService } from "src/app/_services/stripe-payment-gateway.service";
import { PaymentNavigationService } from "src/app/payments/payment-navigation.service";
import { Order } from "src/app/_models/orders/order";
import { OrdersService } from "src/app/orders/orders.config";
import {
  OrderProductsTableComponent
} from "src/app/orders/components/order-products-table/order-products-table.component";

@Component({
  selector: 'app-payment-checkout',
  templateUrl: './payment-checkout.component.html',
  styleUrls: [ './payment-checkout.component.scss' ],
  imports: [
    CurrencyPipe,
    CheckoutAddressEntryCardComponent,
    CheckoutPaymentMethodEntryCardComponent,
    RouterLink,
    OrderProductsTableComponent
  ]
})
export class PaymentCheckoutComponent implements OnInit, OnDestroy {
  private readonly paymentGatewayService: StripePaymentGatewayService = inject(StripePaymentGatewayService);
  private readonly paymentNavigationService: PaymentNavigationService = inject(PaymentNavigationService);
  private readonly paymentCheckoutService: PaymentCheckoutService = inject(PaymentCheckoutService);
  private readonly eventsService: EventsService = inject(EventsService);
  private readonly ordersService: OrdersService = inject(OrdersService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly toastr: ToastrService = inject(ToastrService);
  private readonly matDialog: MatDialog = inject(MatDialog);
  private readonly router: Router = inject(Router);

  private readonly destroy$: Subject<void> = new Subject<void>();

  id!: string;
  type!: 'cita' | 'receta' | 'medicamentos';
  title: string = '';
  cancelUrl: string = '';

  tax: number = 0;
  total: number = 0;
  subtotal: number = 0;

  selectedPaymentMethod: PaymentMethod | null = null;
  selectedAddress: Address | null = null;

  event: Event | null = null;
  order: Order | null = null;

  ngOnInit(): void {
    const url: string = this.router.url;
    if (url.includes('/cita/')) {
      this.type = 'cita';
      this.title = 'Pago de Cita';
      this.id = this.route.snapshot.paramMap.get('id') || '';
      this.getEventDetails(+this.id);
    } else if (url.includes('/receta/')) {
      this.type = 'receta';
      this.title = 'Pago de Receta';
      this.id = this.route.snapshot.paramMap.get('id') || '';
      this.getOrderDetails(+this.id);
    } else if (url.includes('/medicamentos/')) {
      this.type = 'medicamentos';
      this.title = 'Pago de Medicamentos';
      this.id = this.route.snapshot.paramMap.get('orderId') || '';
    }

    this.cancelUrl = this.route.snapshot.queryParamMap.get('cancelUrl') || '';

    this.subscribeToSelectedAddress();
    this.subscribeToSelectedPaymentMethod();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToSelectedAddress() {
    this.paymentCheckoutService.selectedAddress$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (address: Address | null) => {
        this.selectedAddress = address;
      }
    });
  }

  private subscribeToSelectedPaymentMethod() {
    this.paymentCheckoutService.selectedPaymentMethod$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (method: PaymentMethod | null) => {
        this.selectedPaymentMethod = method;
      }
    });
  }

  private getEventDetails(eventId: number) {
    this.eventsService.getById(eventId).subscribe({
      next: (event) => {
        this.event = event;
        if (event.service && event.service.price) {
          this.subtotal = event.service.price;
          this.tax = event.service.price * 0.16;
          this.total = event.service.price + this.tax;
        }
      },
      error: (err) => {
        console.error('Error fetching event details:', err);
      }
    });
  }

  private getOrderDetails(orderId: number) {
    this.ordersService.getById(orderId).subscribe({
      next: (order) => {
        this.order = order;
        if (order.total) {
          this.subtotal = order.total;
          this.tax = order.total * 0.16;
          this.total = order.total + this.tax;
        }
      },
      error: (err) => {
        console.error('Error fetching order details:', err);
      }
    });
  }

  onProceedPayment(): void {
    switch (this.type) {
      case 'cita':
        this.payEvent();
        break;
      case 'receta':
        this.payOrder();
        break;
      default:
        this.toastr.error('No se ha encontrado el tipo de pago');

    }

  }

  private payEvent(): void {
    const eventId: number | null = this.event?.id || null;
    const selectedPaymentMethodId: number | null = this.selectedPaymentMethod?.id || null;

    if (!eventId || !selectedPaymentMethodId) {
      this.toastr.error('No se ha seleccionado un método de pago o no se ha encontrado el evento');
      return;
    }

    this.paymentGatewayService.createPaymentIntentForEvent(eventId, selectedPaymentMethodId).subscribe({
      next: (res) => {
        if (!res.paymentId) {
          console.error('Payment ID not found in response');
          return;
        }

        this.paymentNavigationService.navigateToCheckoutSuccess(res.paymentId, this.cancelUrl)
          .catch((err: any) => console.error('Navigation error:', err));
      }, error: (err) => {
        console.error('Error creating payment intent:', err);
        this.toastr.error('Error al procesar el pago');
      }
    })
  }

  private payOrder(): void {
    const orderId: number | null = this.order?.id || null;
    const selectedPaymentMethodId: number | null = this.selectedPaymentMethod?.id || null;

    if (!orderId || !selectedPaymentMethodId) {
      this.toastr.error('No se ha seleccionado un método de pago o no se ha encontrado la orden');
      return;
    }

    this.paymentGatewayService.createPaymentIntentForOrder(orderId, selectedPaymentMethodId).subscribe({
      next: (res) => {
        if (!res.paymentId) {
          console.error('Payment ID not found in response');
          return;
        }

        this.paymentNavigationService.navigateToCheckoutSuccess(res.paymentId, this.cancelUrl)
          .catch((err: any) => console.error('Navigation error:', err));
      }, error: (err) => {
        console.error('Error creating payment intent:', err);
        this.toastr.error('Error al procesar el pago');
      }
    })
  }

  onApplyPromoCode(): void {
    this.toastr.error('El código promocional no es válido');
  }

  onCancel(): void {
    const cancelUrl: string = this.route.snapshot.queryParams['cancelUrl'] || '';
    const dialogData: RedirectWarningData = {
      message: '¿Deseas cancelar la operación?'
    };

    this.matDialog.open(RedirectWarningModalComponent, { data: dialogData })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          if (cancelUrl) {
            this.router.navigateByUrl(cancelUrl).catch(err => console.error('Navigation error:', err));
          } else {
            window.history.back();
          }
        }
      });
  }
}
