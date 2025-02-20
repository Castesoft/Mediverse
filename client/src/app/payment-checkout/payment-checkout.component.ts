import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import {
  RedirectWarningModalComponent
} from "src/app/_shared/components/redirect-warning-modal/redirect-warning-modal.component";
import { RedirectWarningData } from "src/app/_shared/components/redirect-warning-modal/redirectWarningData";
import { CurrencyPipe, DatePipe } from "@angular/common";
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
import {
  AddressDisplayCardComponent
} from "src/app/addresses/components/address-display-card/address-display-card.component";
import { AddressSelectorComponent } from "src/app/addresses/components/address-selector/address-selector.component";
import { UserDropdownComponent } from "src/app/_shared/template/components/user-dropdown.component";
import { BsDropdownDirective } from "ngx-bootstrap/dropdown";

@Component({
  selector: 'app-payment-checkout',
  templateUrl: './payment-checkout.component.html',
  styleUrls: [ './payment-checkout.component.scss' ],
  imports: [ CurrencyPipe, CheckoutAddressEntryCardComponent, CheckoutPaymentMethodEntryCardComponent, RouterLink, AddressDisplayCardComponent, AddressSelectorComponent, UserDropdownComponent, BsDropdownDirective, DatePipe ],
})
export class PaymentCheckoutComponent implements OnInit, OnDestroy {
  private readonly paymentCheckoutService: PaymentCheckoutService = inject(PaymentCheckoutService);
  private readonly eventsService: EventsService = inject(EventsService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly matDialog: MatDialog = inject(MatDialog);
  private readonly router: Router = inject(Router);

  private readonly destroy$: Subject<void> = new Subject<void>();

  id!: string;
  type!: string;
  title: string = '';
  cancelUrl: string = '';

  tax: number = 0;
  total: number = 0;
  subtotal: number = 0;

  selectedPaymentMethod: PaymentMethod | null = null;
  selectedAddress: Address | null = null;

  event: Event | null = null;

  ngOnInit(): void {
    const url: string = this.router.url;
    if (url.includes('/cita/')) {
      this.type = 'cita';
      this.title = 'Pago de Cita';
      this.id = this.route.snapshot.paramMap.get('id') || '';
    } else if (url.includes('/receta/')) {
      this.type = 'receta';
      this.title = 'Pago de Receta';
      this.id = this.route.snapshot.paramMap.get('id') || '';
    } else if (url.includes('/medicamentos/')) {
      this.type = 'medicamentos';
      this.title = 'Pago de Medicamentos';
      this.id = this.route.snapshot.paramMap.get('orderId') || '';
    }
    this.cancelUrl = this.route.snapshot.queryParamMap.get('cancelUrl') || '';

    this.getEventDetails(+this.id);

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

  onProceedPayment(): void {
    const dialogData: RedirectWarningData = {
      message: 'Se te redirigirá a la ventana de pago. ¿Deseas continuar?'
    };

    this.matDialog.open(RedirectWarningModalComponent, { data: dialogData })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          console.log('Proceeding with payment...');
          // TODO - Insert payment processing logic here (e.g. invoking StripePaymentGatewayService)
        }
      });
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
