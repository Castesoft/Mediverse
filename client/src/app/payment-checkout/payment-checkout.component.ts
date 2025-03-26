import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import {
  RedirectWarningModalComponent
} from "src/app/_shared/components/redirect-warning-modal/redirect-warning-modal.component";
import { RedirectWarningData } from "src/app/_shared/components/redirect-warning-modal/redirectWarningData";
import { PaymentMethod } from "src/app/_models/paymentMethod/paymentMethod";
import Event from "src/app/_models/events/event";
import { Address } from "src/app/_models/addresses/address";
import { PaymentCheckoutService } from "src/app/payment-checkout/payment-checkout.service";
import {
  CheckoutAddressEntryCardComponent
} from "src/app/payment-checkout/components/checkout-address-entry-card/checkout-address-entry-card.component";
import {
  CheckoutPaymentMethodEntryCardComponent
} from "src/app/payment-checkout/components/checkout-payment-method-entry-card/checkout-payment-method-entry-card.component";
import { ToastrService } from "ngx-toastr";
import { StripeGatewayService } from "src/app/_services/stripe-gateway.service";
import { PaymentNavigationService } from "src/app/payments/payment-navigation.service";
import { Order } from "src/app/_models/orders/order";
import { OrdersService } from "src/app/orders/orders.config";
import {
  SubscriptionOnboardingComponent
} from "src/app/payment-checkout/subscription-onboarding/subscription-onboarding.component";
import { ThemeService } from 'src/app/_services/theme.service';
import { PaymentSummaryComponent } from "src/app/payment-checkout/components/payment-summary/payment-summary.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EventsService } from "src/app/events/events.service";

@Component({
  selector: 'app-payment-checkout',
  templateUrl: './payment-checkout.component.html',
  styleUrls: [ './payment-checkout.component.scss' ],
  imports: [
    CheckoutAddressEntryCardComponent,
    CheckoutPaymentMethodEntryCardComponent,
    RouterLink,
    SubscriptionOnboardingComponent,
    PaymentSummaryComponent
  ]
})
export class PaymentCheckoutComponent implements OnInit {
  private readonly paymentGatewayService: StripeGatewayService = inject(StripeGatewayService);
  private readonly paymentNavigationService: PaymentNavigationService = inject(PaymentNavigationService);
  private readonly paymentCheckoutService: PaymentCheckoutService = inject(PaymentCheckoutService);
  private readonly eventsService: EventsService = inject(EventsService);
  private readonly ordersService: OrdersService = inject(OrdersService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly toastr: ToastrService = inject(ToastrService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly matDialog: MatDialog = inject(MatDialog);
  private readonly router: Router = inject(Router);

  readonly theme: ThemeService = inject(ThemeService);

  id!: string;
  type!: 'cita' | 'receta' | 'medicamentos' | 'suscripcion';
  title: string = '';
  cancelUrl: string = '';

  tax: number = 0;
  total: number = 0;
  subtotal: number = 0;

  selectedPaymentMethod: PaymentMethod | null = null;
  selectedAddress: Address | null = null;

  event: Event | null = null;
  order: Order | null = null;

  isLoading: boolean = false;

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
    } else if (url.includes('/suscripcion')) {
      this.type = 'suscripcion';
      this.title = 'Pago de Suscripción';
    }

    this.cancelUrl = this.route.snapshot.queryParamMap.get('cancelUrl') || '';

    this.subscribeToSelectedAddress();
    this.subscribeToSelectedPaymentMethod();
  }

  private subscribeToSelectedAddress() {
    this.paymentCheckoutService.selectedAddress$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (address: Address | null) => {
        this.selectedAddress = address;
      }
    });
  }

  private subscribeToSelectedPaymentMethod() {
    this.paymentCheckoutService.selectedPaymentMethod$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
    this.isLoading = true;

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
    const selectedAddressId: number | null = this.selectedAddress?.id || null;

    if (!eventId) {
      this.toastr.error('No se ha encontrado el evento');
      return;
    }

    if (!selectedPaymentMethodId) {
      this.toastr.error('No se ha seleccionado un método de pago');
      return;
    }

    if (!selectedAddressId) {
      this.toastr.error('No se ha seleccionado una dirección de envío');
      return;
    }

    this.paymentGatewayService.createPaymentIntentForEvent(eventId, selectedPaymentMethodId, selectedAddressId).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (!res.paymentId) {
          console.error('Payment ID not found in response');
          return;
        }

        this.paymentNavigationService.navigateToCheckoutSuccess(res.paymentId, this.cancelUrl)
          .catch((err: any) => console.error('Navigation error:', err));
      }, error: (err) => {
        this.isLoading = false;
        console.error('Error creating payment intent:', err);
        this.toastr.error('Error al procesar el pago');
      }
    })
  }

  private payOrder(): void {
    const orderId: number | null = this.order?.id || null;
    const selectedPaymentMethodId: number | null = this.selectedPaymentMethod?.id || null;
    const selectedAddressId: number | null = this.selectedAddress?.id || null;

    if (!orderId) {
      this.toastr.error('No se ha encontrado la orden.');
      return;
    }

    if (!selectedPaymentMethodId) {
      this.toastr.error('No se ha seleccionado un método de pago');
      return;
    }

    if (!selectedAddressId) {
      this.toastr.error('No se ha seleccionado una dirección de envío');
      return;
    }

    this.paymentGatewayService.createPaymentIntentForOrder(orderId, selectedPaymentMethodId, selectedAddressId).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (!res.paymentId) {
          console.error('Payment ID not found in response');
          return;
        }

        this.paymentNavigationService.navigateToCheckoutSuccess(res.paymentId, this.cancelUrl)
          .catch((err: any) => console.error('Navigation error:', err));
      }, error: (err) => {
        this.isLoading = false;
        console.error('Error creating payment intent:', err);
        this.toastr.error('Error al procesar el pago');
      }
    })
  }

  onCancel(): void {
    const cancelUrl: string = this.route.snapshot.queryParams['cancelUrl'] || '';
    const dialogData: RedirectWarningData = {
      message: '¿Deseas cancelar la operación?'
    };

    this.matDialog.open(RedirectWarningModalComponent, { data: dialogData }).afterClosed().subscribe((confirmed: boolean) => {
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
