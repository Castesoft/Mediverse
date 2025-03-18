import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import Event from 'src/app/_models/events/event';
import { FormUse } from 'src/app/_models/forms/formTypes';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';
import { Data, Navigation, RouterLink, RouterLinkActive } from '@angular/router';

import { PaymentCheckoutService } from 'src/app/payment-checkout/payment-checkout.service';
import { StripeGatewayService } from 'src/app/_services/stripe-gateway.service';
import { PaymentNavigationService } from 'src/app/payments/payment-navigation.service';
import { ToastrService } from 'ngx-toastr';
import { PaymentMethod } from 'src/app/_models/paymentMethod/paymentMethod';
import {
  CheckoutAddressEntryCardComponent
} from 'src/app/payment-checkout/components/checkout-address-entry-card/checkout-address-entry-card.component';
import {
  CheckoutPaymentMethodEntryCardComponent
} from 'src/app/payment-checkout/components/checkout-payment-method-entry-card/checkout-payment-method-entry-card.component';
import {
  PaymentDisclaimerComponent
} from 'src/app/payment-checkout/components/subscription-terms-and-conditions-disclaimer-notice/payment-disclaimer.component';
import { PhotoShape, PhotoSize } from 'src/app/_models/photos/photoTypes';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RedirectWarningData } from 'src/app/_shared/components/redirect-warning-modal/redirectWarningData';
import {
  RedirectWarningModalComponent
} from 'src/app/_shared/components/redirect-warning-modal/redirect-warning-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { NurseDisplayCardComponent } from 'src/app/nurses/components/nurse-display-card.component';

import { ClinicalHistoryConsentService } from 'src/app/_services/clinical-history-consent.service';
import { ClinicalHistoryVerification } from 'src/app/_models/clinicalHistoryVerification';
import {
  ClinicalHistoryConsentModalComponent,
  ClinicalHistoryConsentModalData
} from 'src/app/clinical-history/clinical-history-consent-modal.component';
import { Patient } from "src/app/_models/patients/patient";
import { Address } from "src/app/_models/addresses/address";
import {
  AccountChildWrapperComponent
} from "src/app/account/components/account-child-wrapper/account-child-wrapper.component";

@Component({
  selector: 'account-event-detail-route',
  templateUrl: './account-event-detail.component.html',
  styleUrls: [ './account-event-detail.component.scss' ],
  standalone: true,
  imports: [
    CommonModule,
    Forms2Module,
    ProfilePictureComponent,
    RouterLink,
    RouterLinkActive,
    CheckoutAddressEntryCardComponent,
    CheckoutPaymentMethodEntryCardComponent,
    PaymentDisclaimerComponent,
    NurseDisplayCardComponent,
    AccountChildWrapperComponent,
  ]
})
export class AccountEventDetailComponent extends BaseRouteDetail<Event> implements OnInit {
  private readonly consentService: ClinicalHistoryConsentService = inject(ClinicalHistoryConsentService);
  private readonly paymentNavigationService: PaymentNavigationService = inject(PaymentNavigationService);
  private readonly paymentCheckoutService: PaymentCheckoutService = inject(PaymentCheckoutService);
  private readonly paymentGatewayService: StripeGatewayService = inject(StripeGatewayService);
  private readonly toastr: ToastrService = inject(ToastrService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly dialog: MatDialog = inject(MatDialog);

  readonly PhotoShape: typeof PhotoShape = PhotoShape;
  readonly PhotoSize: typeof PhotoSize = PhotoSize;

  event!: Event;
  subtotal: number = 0;
  total: number = 0;
  tax: number = 0;

  selectedPaymentMethod: PaymentMethod | null = null;
  selectedAddress: any = null;
  selectedTab: string = 'general';

  isSubmittingPayment: boolean = false;
  showPaymentSection: boolean = false;
  consentStatus: boolean = false;

  constructor() {
    super('events', FormUse.DETAIL);
    this.key.set(`${this.router.url}#account-event-detail`);
    this.initializeRouteData();
  }

  ngOnInit(): void {
    this.event = this.route.snapshot.data['item'];
    if (!this.event) {
      this.router.navigate([ '/cuenta/citas' ]).catch(console.error);
      return;
    }

    this.calculateTotals();
    this.subscribeToCheckoutData();
    this.fetchConsentStatus();
  }

  private initializeRouteData(): void {
    this.route.paramMap.subscribe(params => {
      const idParam: string | null = params.get('id');
      if (idParam) {
        this.id.set(+idParam);
      }
    });

    this.route.data.subscribe((data: Data) => {
      this.item.set(data['item']);
      const codeNumber: number | null = this.item()?.codeNumber || null;
      if (codeNumber) {
        this.label.update(() => codeNumber.toString());
      }
    });

    const navigation: Navigation | null = this.router.getCurrentNavigation();
    const key: string | null = navigation?.extras?.state?.['key'] || null;
    if (key) {
      this.key.set(key);
    }
  }

  private calculateTotals(): void {
    if (this.event.service?.price) {
      this.subtotal = this.event.service.price;
      this.tax = this.event.service.price * 0.16;
      this.total = this.event.service.price + this.tax;
    }
  }

  private subscribeToCheckoutData(): void {
    this.paymentCheckoutService.selectedAddress$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((address: Address | null) => {
      this.selectedAddress = address;
    });

    this.paymentCheckoutService.selectedPaymentMethod$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((method: PaymentMethod | null) => {
      this.selectedPaymentMethod = method;
    });
  }

  private fetchConsentStatus(): void {
    const userId: number | null = this.item()?.doctor?.id || null;
    const patientId: number | null = this.item()?.patient?.id || null;

    if (!userId || !patientId) {
      console.error('User or patient ID is null.');
      return;
    }

    this.consentService.getConsentStatus(userId, patientId).subscribe((status: ClinicalHistoryVerification) => {
      this.consentStatus = status.hasAccess;
    });
  }

  onProceedPayment(): void {
    this.isSubmittingPayment = true;

    const eventId: number | null = this.event?.id;
    const selectedPaymentMethodId: number | null = this.selectedPaymentMethod?.id || null;

    if (!eventId || !selectedPaymentMethodId) {
      this.toastr.error('No se ha seleccionado un método de pago o no se ha encontrado el evento');
      this.isSubmittingPayment = false;
      return;
    }

    this.paymentGatewayService.createPaymentIntentForEvent(eventId, selectedPaymentMethodId).subscribe({
      next: (res) => {
        if (!res.paymentId) {
          console.error('Payment ID not found in response');
          this.isSubmittingPayment = false;
          return;
        }

        this.isSubmittingPayment = false;

        this.paymentNavigationService.navigateToCheckoutSuccess(res.paymentId, window.location.href)
          .catch(console.error);
      },
      error: (err) => {
        this.isSubmittingPayment = false;
        console.error('Error creating payment intent:', err);
        this.toastr.error('Error al procesar el pago');
      }
    });
  }

  showConfirmPaymentInitiationNotice(): void {
    const patient: Patient = this.event.patient;

    if (!this.event.id || !patient?.id) {
      console.error('Missing event or patient details for checkout.');
      return;
    }

    const dialogData: RedirectWarningData = {
      message: 'Se iniciará el proceso de pago en esta misma ventana. ¿Deseas continuar?'
    };

    this.dialog.open(RedirectWarningModalComponent, { data: dialogData }).afterClosed().subscribe((confirmed: boolean) => {
      this.showPaymentSection = confirmed;
    });
  }

  onApplyPromoCode(): void {
    this.toastr.error('El código promocional no es válido');
  }

  onShareMedicalHistory(): void {
    const patientId: number | null = this.item()?.patient?.id || null;
    const doctorId: number | null = this.item()?.doctor?.id || null;

    if (!patientId || !doctorId) {
      console.error('Patient or doctor ID is null.');
      return;
    }

    const dialogData: ClinicalHistoryConsentModalData = {
      doctorId: doctorId,
      patientId: patientId,
      currentConsent: this.consentStatus
    };

    this.dialog.open(ClinicalHistoryConsentModalComponent, {
      data: dialogData,
      width: '400px',
      autoFocus: false
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.consentService.updateConsentStatus(doctorId, patientId, !this.consentStatus).subscribe({
        next: (updatedStatus: ClinicalHistoryVerification) => {
          this.consentStatus = updatedStatus.hasAccess;
          this.toastr.success('Historial clínico compartido exitosamente.');
        }
      });
    });
  }

  getDoctorTitle(): string {
    return this.event.doctor.sex as any === 'Femenino' ? 'Dra.' : 'Dr.';
  }
}
