import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import Event from 'src/app/_models/events/event';
import { FormUse } from 'src/app/_models/forms/formTypes';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { PaymentCheckoutService } from 'src/app/payment-checkout/payment-checkout.service';
import { StripeGatewayService } from 'src/app/_services/stripe-gateway.service';
import { PaymentNavigationService } from 'src/app/payments/payment-navigation.service';
import { ToastrService } from 'ngx-toastr';
import { PaymentMethod } from 'src/app/_models/paymentMethod/paymentMethod';
import {
  CheckoutAddressEntryCardComponent
} from "src/app/payment-checkout/components/checkout-address-entry-card/checkout-address-entry-card.component";
import {
  CheckoutPaymentMethodEntryCardComponent
} from "src/app/payment-checkout/components/checkout-payment-method-entry-card/checkout-payment-method-entry-card.component";
import {
  PaymentDisclaimerComponent
} from "src/app/payment-checkout/components/subscription-terms-and-conditions-disclaimer-notice/payment-disclaimer.component";
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Patient } from "src/app/_models/patients/patient";
import { RedirectWarningData } from "src/app/_shared/components/redirect-warning-modal/redirectWarningData";
import {
  RedirectWarningModalComponent
} from "src/app/_shared/components/redirect-warning-modal/redirect-warning-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { NurseDisplayCardComponent } from "src/app/nurses/components/nurse-display-card.component";
import { ClinicalHistoryConsentService } from 'src/app/_services/clinical-history-consent.service';
import { ClinicalHistoryVerification } from 'src/app/_models/clinicalHistoryVerification';
import { ClinicalHistoryConsentModalComponent, ClinicalHistoryConsentModalData } from 'src/app/clinical-history/clinical-history-consent-modal.component';

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
  ]
})
export class AccountEventDetailComponent extends BaseRouteDetail<Event> implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  event!: Event;
  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;
  selectedPaymentMethod: PaymentMethod | null = null;
  selectedAddress: any = null;
  selectedTab: string = 'general';

  showPaymentSection = signal<boolean>(false);
  consentStatus = signal<boolean>(false);

  private readonly consentService: ClinicalHistoryConsentService = inject(ClinicalHistoryConsentService);
  private readonly paymentCheckoutService: PaymentCheckoutService = inject(PaymentCheckoutService);
  private readonly paymentGatewayService: StripeGatewayService = inject(StripeGatewayService);
  private readonly paymentNavigationService: PaymentNavigationService = inject(PaymentNavigationService);
  private readonly toastr: ToastrService = inject(ToastrService);
  private readonly dialog: MatDialog = inject(MatDialog);

  readonly matDialog: MatDialog = inject(MatDialog);

  constructor() {
    super('events', FormUse.DETAIL);
    this.key.set(`${this.router.url}#account-event-detail`);

    effect(() => {
      this.route.paramMap.subscribe({
        next: params => {
          if (params.has('id')) {
            this.id.set(+params.get('id')!);
          }
        }
      });
      this.route.data.subscribe({
        next: (data) => {
          this.item.set(data['item']);
          const itemForLabel = this.item();
          if (itemForLabel !== null && itemForLabel !== undefined) {
            const codeNumberLabel = itemForLabel.codeNumber;
            if (codeNumberLabel !== null && codeNumberLabel !== undefined) {
              this.label.update(_ => codeNumberLabel.toString());
            }
          }
        },
      });
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }

    })

  }

  ngOnInit(): void {
    this.event = this.route.snapshot.data['item'];
    if (!this.event) {
      this.router.navigate([ '/cuenta/citas' ]).catch(console.error);
      return;
    }

    if (this.event.service && this.event.service.price) {
      this.subtotal = this.event.service.price;
      this.tax = this.event.service.price * 0.16;
      this.total = this.event.service.price + this.tax;
    }

    this.paymentCheckoutService.selectedAddress$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(address => {
      this.selectedAddress = address;
    });

    this.paymentCheckoutService.selectedPaymentMethod$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(method => {
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

    this.consentService.getConsentStatus(userId, patientId)
      .subscribe((status: ClinicalHistoryVerification) => {
        this.consentStatus.update(_ => status.hasAccess);
      });
  }

  onProceedPayment(): void {
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

        this.paymentNavigationService.navigateToCheckoutSuccess(res.paymentId, '')
          .catch((err: any) => console.error('Navigation error:', err));
      },
      error: (err) => {
        console.error('Error creating payment intent:', err);
        this.toastr.error('Error al procesar el pago');
      }
    });
  }

  showConfirmPaymentInitiationNotice(): void {
    const patient: Patient | undefined = this.event.patient;
    if (!this.event.id || !patient?.id) {
      console.error('Missing event or patient details for checkout.');
      return;
    }

    const dialogData: RedirectWarningData = {
      message: 'Se iniciará el proceso de pago en esta misma ventana. ¿Deseas continuar?'
    };

    this.matDialog.open(RedirectWarningModalComponent, { data: dialogData })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.showPaymentSection.update(_ => true);
        }
      });
  }

  onApplyPromoCode(): void {
    this.toastr.error('El código promocional no es válido');
  }

  onShareMedicalHistory(): void {

    console.log('Sharing medical history...', this.item());


    const patientId: number | null = this.item()?.patient?.id || null;
    const doctorId: number | null = this.item()?.doctor?.id || null;

    if (!patientId || !doctorId) {
      console.error('Patient or doctor ID is null.');
      return
    }

    const dialogData: ClinicalHistoryConsentModalData = {
      doctorId: doctorId,
      patientId: patientId,
      currentConsent: this.consentStatus()
    };

    this.dialog.open(ClinicalHistoryConsentModalComponent, {
      data: dialogData,
      width: '400px',
      autoFocus: false
    }).afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.consentService.updateConsentStatus(doctorId, patientId, !this.consentStatus())
          .subscribe((updatedStatus: ClinicalHistoryVerification) => {
            console.log('Updated consent status:', updatedStatus);
            this.consentStatus.update(_ => updatedStatus.hasAccess);
            this.toastr.success('Historial clínico compartido exitosamente.');
          });
      }
    });
  }

  protected readonly PhotoShape = PhotoShape;
  protected readonly PhotoSize = PhotoSize;
}
