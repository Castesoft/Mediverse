import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import Event from 'src/app/_models/events/event';
import { FormUse } from 'src/app/_models/forms/formTypes';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';
import { Navigation, ParamMap, RouterLink, RouterLinkActive } from '@angular/router';

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
import { PhotoShape, PhotoSize } from 'src/app/_models/photos/photoTypes';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RedirectWarningData } from 'src/app/_shared/components/redirect-warning-modal/redirectWarningData';
import {
  RedirectWarningModalComponent
} from 'src/app/_shared/components/redirect-warning-modal/redirect-warning-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { NurseDisplayCardComponent } from 'src/app/nurses/components/nurse-display-card.component';
import { PrescriptionsService } from 'src/app/prescriptions/prescriptions.service';
import {
  PrescriptionFormComponent
} from 'src/app/prescriptions/components/prescription-form/prescription-form.component';
import { ClinicalHistoryConsentService } from 'src/app/_services/clinical-history-consent.service';
import { ClinicalHistoryVerification } from 'src/app/_models/clinicalHistoryVerification';
import {
  ClinicalHistoryConsentModalComponent,
  ClinicalHistoryConsentModalData
} from 'src/app/clinical-history/clinical-history-consent-modal.component';
import { Patient } from "src/app/_models/patients/patient";
import { Address } from "src/app/_models/addresses/address";
import { Prescription } from 'src/app/_models/prescriptions/prescription';
import {
  AccountChildWrapperComponent
} from "src/app/account/components/account-child-wrapper/account-child-wrapper.component";
import { PaymentSummaryComponent } from "src/app/payment-checkout/components/payment-summary/payment-summary.component";
import { Title } from "@angular/platform-browser";

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
    NurseDisplayCardComponent,
    AccountChildWrapperComponent,
    PaymentSummaryComponent,
    PrescriptionFormComponent,
  ]
})
export class AccountEventDetailComponent extends BaseRouteDetail<Event> implements OnInit {
  private readonly consentService: ClinicalHistoryConsentService = inject(ClinicalHistoryConsentService);
  private readonly paymentNavigationService: PaymentNavigationService = inject(PaymentNavigationService);
  private readonly paymentCheckoutService: PaymentCheckoutService = inject(PaymentCheckoutService);
  private readonly paymentGatewayService: StripeGatewayService = inject(StripeGatewayService);
  private readonly prescriptionsService: PrescriptionsService = inject(PrescriptionsService);
  private readonly toastr: ToastrService = inject(ToastrService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly titleService: Title = inject(Title);

  readonly PhotoShape: typeof PhotoShape = PhotoShape;
  readonly PhotoSize: typeof PhotoSize = PhotoSize;
  readonly FormUse: typeof FormUse = FormUse;

  event!: Event;
  subtotal: number = 0;
  total: number = 0;
  tax: number = 0;

  selectedPaymentMethod: PaymentMethod | null = null;
  selectedAddress: any = null;
  selectedTab: WritableSignal<string> = signal('general');


  detailedPrescriptions: WritableSignal<Prescription[] | null> = signal(null);
  prescriptionsLoading: WritableSignal<boolean> = signal(false);

  isSubmittingPayment: boolean = false;
  showPaymentSection: boolean = false;
  consentStatus: boolean = false;

  constructor() {
    super('events', FormUse.DETAIL);
    this.key.set(`${this.router.url}#account-event-detail`);
    this.initializeRouteData();


    effect(() => {
      const currentEvent: Event = this.event;
      const currentTab: string = this.selectedTab();

      if (currentEvent && currentTab === 'recetas' && this.detailedPrescriptions() === null && !this.prescriptionsLoading()) {
        this.loadDetailedPrescriptions();
      }
    });
  }

  ngOnInit(): void {
    this.event = this.route.snapshot.data['item'];
    if (!this.event) {
      this.router.navigate([ '/cuenta/citas' ]).catch(console.error);
      return;
    }

    if (this.event.id) {
      this.id.set(this.event.id);
    }

    this.subtotal = this.event.service.price || 0;
    this.subscribeToCheckoutData();
    this.subscribeToQueryParams();
    this.fetchConsentStatus();
    this.setTitle();
  }

  private initializeRouteData(): void {
    const navigation: Navigation | null = this.router.getCurrentNavigation();
    const key: string | null = navigation?.extras?.state?.['key'] || null;
    if (key) {
      this.key.set(key);
    }
  }

  private subscribeToQueryParams(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: ParamMap) => {
      const inferiorTab: string | null = params.get('inferiorTab');
      if (inferiorTab) {
        this.selectedTab.set(inferiorTab);
      }
    });
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
    const userId: number | null = this.event.doctor?.id || null;
    const patientId: number | null = this.event.patient?.id || null;

    if (!userId || !patientId) {
      console.error('User or patient ID is null.');
      return;
    }

    this.consentService.getConsentStatus(userId, patientId).subscribe((status: ClinicalHistoryVerification) => {
      this.consentStatus = status.hasAccess;
    });
  }

  private setTitle(): void {
    const dateParsed = new Date(this.event.dateFrom as any);
    let title: string = "DocHub | Cita";

    if (dateParsed) {
      title += ` del ${new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(dateParsed)}`;
    }

    if (this.event.doctor && this.event.doctor.firstName && this.event.doctor.lastName) {
      title += ` con ${this.getDoctorArticle()} ${this.getDoctorTitle()} ${this.event.doctor.firstName} ${this.event.doctor.lastName}`;
    }

    this.titleService.setTitle(title);
  }


  private loadDetailedPrescriptions(): void {
    if (!this.event) {
      console.warn('loadDetailedPrescriptions called before event was loaded.');
      return;
    }
    const prescriptionIds = this.event.prescriptions?.map(p => p.id).filter((id): id is number => id !== null && id !== undefined);

    if (!prescriptionIds || prescriptionIds.length === 0) {
      this.detailedPrescriptions.set([]);
      return;
    }

    this.prescriptionsLoading.set(true);
    this.detailedPrescriptions.set(null);

    const prescriptionObservables: Observable<Prescription | null>[] = prescriptionIds.map(id =>
      this.prescriptionsService.getById(id).pipe(
        catchError(error => {
          console.error(`Error fetching prescription with ID ${id}:`, error);
          this.toastr.error(`Error al cargar la receta #${id}.`);
          return of(null);
        })
      )
    );

    forkJoin(prescriptionObservables).pipe(finalize(() => this.prescriptionsLoading.set(false))).subscribe((results: (Prescription | null)[]) => {

      const successfullyLoadedPrescriptions = results.filter((p): p is Prescription => p !== null);
      this.detailedPrescriptions.set(successfullyLoadedPrescriptions);
    });
  }

  onProceedPayment(): void {
    this.isSubmittingPayment = true;

    const eventId: number | null = this.event?.id;
    const selectedPaymentMethodId: number | null = this.selectedPaymentMethod?.id || null;
    const selectedAddressId: number | null = this.selectedAddress?.id || null;

    if (!eventId) {
      console.error('Event ID not found');
      this.isSubmittingPayment = false;
      return;
    }

    if (!selectedPaymentMethodId) {
      console.error('Payment method ID not found');
      this.isSubmittingPayment = false;
      return;
    }

    if (!selectedAddressId) {
      console.error('Address ID not found');
      this.isSubmittingPayment = false;
      return;
    }

    this.paymentGatewayService.createPaymentIntentForEvent(eventId, selectedPaymentMethodId, selectedAddressId).subscribe({
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

  onShareMedicalHistory(): void {
    const patientId: number | null = this.event.patient?.id || null;
    const doctorId: number | null = this.event.doctor?.id || null;

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

  getDoctorArticle(): string {
    return this.event.doctor.sex as any === 'Femenino' ? 'la' : 'el';
  }

  getDoctorTitle(): string {
    return this.event.doctor.sex as any === 'Femenino' ? 'Dra.' : 'Dr.';
  }

  async downloadPrescription(prescription: Prescription): Promise<void> {
    const elementId = `prescription-form-${prescription.id}`;
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID ${elementId} not found for download.`);
      this.toastr.error('No se pudo encontrar el elemento de la receta para descargar.');
      return;
    }
    try {
      await this.prescriptionsService.export(prescription, element, 'download');
    } catch (error) {
      console.error('Error downloading prescription:', error);
      this.toastr.error('Error al descargar la receta.');
    }
  }

  async printPrescription(prescription: Prescription): Promise<void> {
    const elementId = `prescription-form-${prescription.id}`;
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID ${elementId} not found for printing.`);
      this.toastr.error('No se pudo encontrar el elemento de la receta para imprimir.');
      return;
    }
    try {
      await this.prescriptionsService.export(prescription, element, 'print');
    } catch (error) {
      console.error('Error printing prescription:', error);
      this.toastr.error('Error al imprimir la receta.');
    }
  }
}
