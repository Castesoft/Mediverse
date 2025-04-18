import {
  Component,
  effect,
  inject,
  model,
  ModelSignal,
  OnInit,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { filter, take } from 'rxjs/operators';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QuillModule } from 'ngx-quill';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

import { DashboardModule } from "src/app/home/dashboard/dashboard.module";
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';

import Event from "src/app/_models/events/event";
import { EventParams } from 'src/app/_models/events/eventParams';
import { EventFiltersForm } from 'src/app/_models/events/eventFiltersForm';
import { EventLowerTabs, EventUpperTabs } from 'src/app/_models/events/eventTypes';
import { CatalogMode, View } from 'src/app/_models/base/types';
import { FormUse } from 'src/app/_models/forms/formTypes';
import { BadRequest } from 'src/app/_models/forms/badRequest';

import { Prescription } from 'src/app/_models/prescriptions/prescription';
import { PrescriptionParams } from 'src/app/_models/prescriptions/prescriptionParams';

import BaseDetail from 'src/app/_models/base/components/extensions/baseDetail';
import { DetailInputSignals } from 'src/app/_models/forms/formComponentInterfaces';

import EvolutionForm from 'src/app/_models/events/detail/evolutionForm';
import NextStepForm from 'src/app/_models/events/detail/nextStepForm';

import { CompactTableService } from 'src/app/_services/compact-table.service';
import { IconsService } from 'src/app/_services/icons.service';

import { EventSummaryComponent } from 'src/app/events/components/event-detail/event-summary/event-summary.component';
import { EventServicesSummaryComponent } from 'src/app/events/components/event-services-summary.component';
import {
  PrescriptionFormComponent
} from 'src/app/prescriptions/components/prescription-form/prescription-form.component';
import {
  PrescriptionsCatalogComponent
} from "src/app/prescriptions/components/prescriptions-catalog/prescriptions-catalog.component";
import { NursesCatalogModalComponent, NursesService } from "src/app/nurses/nurses.config";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import Nurse from "src/app/_models/nurses/nurse";
import { NurseParams } from "src/app/_models/nurses/nurseParams";
import { createId } from "@paralleldrive/cuid2";
import { MatDialog } from "@angular/material/dialog";
import {
  ConfirmationDialogData,
  ConfirmationModalComponent
} from 'src/app/_shared/components/confirmation-modal/confirmation-modal.component';
import { NurseDisplayCardComponent } from "src/app/nurses/components/nurse-display-card.component";
import { Payment } from "src/app/_models/payments/payment";
import { PaymentParams } from "src/app/_models/payments/paymentParams";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { PaymentNavigationService } from "src/app/payments/payment-navigation.service";
import { Patient } from "src/app/_models/patients/patient";
import { RedirectWarningData } from "src/app/_shared/components/redirect-warning-modal/redirectWarningData";
import {
  RedirectWarningModalComponent
} from "src/app/_shared/components/redirect-warning-modal/redirect-warning-modal.component";
import { AccountService } from "src/app/_services/account.service";
import {
  ClinicalHistoryConsentModalComponent,
  ClinicalHistoryConsentModalData
} from "src/app/clinical-history/clinical-history-consent-modal.component";
import { ClinicalHistoryVerification } from "src/app/_models/clinicalHistoryVerification";
import { ClinicalHistoryConsentService } from "src/app/_services/clinical-history-consent.service";
import { ToastrService } from "ngx-toastr";
import { PaymentsCatalogComponent } from "src/app/payments/payments-catalog.component";
import { EventsService } from "src/app/events/events.service";
import { PaymentStatusBadgeComponent } from "src/app/_shared/components/payment-status-badge/payment-status-badge.component";
import { PaymentStatus } from "src/app/_models/payments/paymentConstants";

@Component({
  selector: 'div[eventWindow]',
  templateUrl: './event-window.component.html',
  styleUrls: [ './event-window.component.scss' ],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    QuillModule,
    DashboardModule,
    BootstrapModule,
    TemplateModule,
    Forms2Module,
    EventServicesSummaryComponent,
    PrescriptionFormComponent,
    EventSummaryComponent,
    PrescriptionsCatalogComponent,
    NurseDisplayCardComponent,
    PaymentsCatalogComponent,
    MatMenuModule,
    PaymentStatusBadgeComponent
  ]
})
export class EventWindowComponent extends BaseDetail<Event, EventParams, EventFiltersForm, EventsService> implements OnInit, DetailInputSignals<Event> {
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Event | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();

  private readonly consentService: ClinicalHistoryConsentService = inject(ClinicalHistoryConsentService);
  private readonly paymentNavigation: PaymentNavigationService = inject(PaymentNavigationService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly toastr: ToastrService = inject(ToastrService);
  private readonly router: Router = inject(Router);

  readonly compact: CompactTableService = inject(CompactTableService);
  readonly accountsService: AccountService = inject(AccountService);
  readonly nurses: NursesService = inject(NursesService);
  readonly icons: IconsService = inject(IconsService);
  readonly matDialog: MatDialog = inject(MatDialog);

  isConfirmingCash: WritableSignal<boolean> = signal(false);

  tax?: number;
  total?: number;

  upperTab: EventUpperTabs = 'evolucion';
  lowerTab: EventLowerTabs = 'general';

  summaryMode: boolean = true;
  summaryOrientation: 'vertical' | 'horizontal' = 'vertical';

  isEvolutionEditing: boolean = false;
  isNextStepsEditing: boolean = false;
  consentStatus: boolean = false;


  prescriptionCuid: string = createId();
  prescriptionItem: WritableSignal<Prescription | null> = signal<Prescription | null>(null);
  prescriptionKey: WritableSignal<string> = signal<string>(this.prescriptionCuid);
  prescriptionView: WritableSignal<View> = signal<View>('inline');
  prescriptionUse: WritableSignal<FormUse> = signal<FormUse>(FormUse.CREATE);
  prescriptions: WritableSignal<Prescription[]> = signal<Prescription[]>([]);
  prescriptionsCatalogMode: WritableSignal<CatalogMode> = signal<CatalogMode>('readonly');
  prescriptionParams: WritableSignal<PrescriptionParams> = signal<PrescriptionParams>(new PrescriptionParams(this.prescriptionCuid));


  nurseCuid: string = createId();
  nurseView: WritableSignal<View> = signal<View>('inline');
  nurseParams: WritableSignal<NurseParams> = signal<NurseParams>(new NurseParams(createId()));


  paymentItem: Payment | null = null;
  paymentView: View = 'page';
  paymentKey: string = createId();
  paymentIsCompact: boolean = true;
  paymentEmbedded: boolean = true;
  paymentUseCard: boolean = false;
  paymentMode: CatalogMode = 'readonly';
  paymentParams: PaymentParams = new PaymentParams(this.paymentKey, {
    fromSection: SiteSection.HOME,
    eventId: null
  });

  @ViewChild('staticTabs', { static: false }) staticTabs!: TabsetComponent;

  evolutionForm: EvolutionForm = new EvolutionForm();
  nextStepForm: NextStepForm = new NextStepForm();

  userRole: 'patient' | 'doctor' = 'patient';

  constructor() {
    super(EventsService);

    effect((): void => {
      this.summaryMode = this.view() === 'modal';
    });

    effect((): void => {
      const event: Event | null = this.item();
      this.userRole = this.accountsService.hasRole([ 'Doctor' ]) ? 'doctor' : 'patient';

      if (event) {
        this.evolutionForm.controls.content.patchValue(event.evolution);
        this.nextStepForm.controls.content.patchValue(event.nextSteps);

        if (this.userRole === 'doctor') {
          this.isNextStepsEditing = event.nextSteps == null;
          this.isEvolutionEditing = event.evolution == null;
        } else {
          this.isNextStepsEditing = false;
          this.isEvolutionEditing = false;
        }

        this.updatePrescriptionParams(event.id);
        this.updatePaymentParams(event.id);
        this.fetchConsentStatus();
      }
    });

    effect((): void => {
      this.router.navigate([], {
        queryParams: {
          superiorTab: this.upperTab,
          inferiorTab: this.lowerTab
        },
        queryParamsHandling: 'merge'
      }).then((): void => {});
    });
  }

  ngOnInit(): void {
    this.setInitialTabsFromParams();
    this.handleDefaultEventAssignment();
    this.subscribeToSelectedNurses();
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
        this.consentStatus = status.hasAccess;
      });
  }

  private updatePrescriptionParams(eventId: number | null): void {
    this.prescriptionParams.set(new PrescriptionParams(`${this.router.url}#event-detail`, { eventId }));
  }

  private updatePaymentParams(eventId: number | null): void {
    this.paymentParams = new PaymentParams(this.paymentKey, { fromSection: SiteSection.HOME, eventId });
  }

  private subscribeToSelectedNurses(): void {
    this.nurses.multipleSelected$(this.nurseCuid).subscribe((selectedNurses) => {
      this.item.update((pastValue): Event | null => {
        return pastValue ? { ...pastValue, nurses: selectedNurses } : null;
      });
    });
  }

  private setInitialTabsFromParams(): void {
    const upperTabFromParams = this.route.snapshot.queryParams['superiorTab'] as EventUpperTabs;
    const lowerTabFromParams = this.route.snapshot.queryParams['inferiorTab'] as EventLowerTabs;

    if (upperTabFromParams) {
      this.upperTab = upperTabFromParams;
    }

    if (lowerTabFromParams) {
      this.lowerTab = lowerTabFromParams;
    }
  }

  private handleDefaultEventAssignment(): void {
    const prescriptionDefaultValues = new Prescription();

    const event: Event | null = this.item();
    if (!event) return;

    if (event.service) {
      this.tax = 0;
      this.total = event.service.price ? event.service.price + (this.tax ?? 0) : 0;
    }

    if (event.prescriptions) this.prescriptions.set(event.prescriptions);
    if (event.createdAt) prescriptionDefaultValues.date = new Date(event.createdAt);
    if (event.patient) prescriptionDefaultValues.patient = event.patient;
    if (event.clinic) prescriptionDefaultValues.clinic = event.clinic;
    if (event.id) prescriptionDefaultValues.event.id = event.id;
    if (event.doctor) prescriptionDefaultValues.doctor = event.doctor;
    if (event.nurses) this.nurses.setMultipleSelected(this.nurseCuid, event.nurses);

    this.prescriptionItem.update(() => prescriptionDefaultValues);
  }

  onSubmitEvolution(): void {
    const event: Event | null = this.item();
    if (!event || event.id == null) {
      throw new Error('Event or Event ID is null.');
    }

    const content: string | null = this.evolutionForm.controls.content.value;
    if (content === null) return;

    this.service.updateEvolution(event.id, content).subscribe({
      next: (): void => {
        this.isEvolutionEditing = false;
      },
      error: (error: BadRequest): void => {
        this.evolutionForm.error = error;
      }
    });
  }

  onSubmitNextSteps(): void {
    const event: Event | null = this.item();
    if (!event || event.id == null) {
      throw new Error('Event or Event ID is null.');
    }

    const content: string | null = this.nextStepForm.controls.content.value;
    if (content === null) return;

    this.service.updateNextSteps(event.id, content).subscribe({
      next: (): void => {
        this.isNextStepsEditing = false;
      },
      error: (error: BadRequest): void => {
        this.nextStepForm.error = error;
      }
    });
  }

  /**
   * Opens a redirect warning modal before navigating to the checkout.
   * If the user confirms, it navigates to the checkout page,
   * passing the current URL as the cancelUrl so the user can go back.
   */
  navigateToCheckout(): void {
    const event: Event | null = this.item();
    const patient: Patient | undefined = event?.patient;
    if (!event?.id || !patient?.id) {
      console.error('Missing event or patient details for checkout.');
      return;
    }

    const dialogData: RedirectWarningData = {
      message: 'Se te redirigirá a la ventana de pago. ¿Deseas continuar?'
    };

    this.matDialog.open(RedirectWarningModalComponent, { data: dialogData })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.paymentNavigation.navigateToCheckout(event.id!, patient.id!, 'cita', this.router.url)
            .catch((err: any) => console.error('Navigation error:', err));
        }
      });
  }

  /**
   * Initiates the cash confirmation process. Opens a confirmation dialog first.
   */
  confirmCashReceived(): void {
    const eventId: number | null = this.item()?.id || null;
    const currentStatus: string | null = this.item()?.paymentStatus || null;

    if (!eventId || currentStatus !== PaymentStatus.AwaitingPayment) {
      this.toastr.warning('No se puede confirmar el pago para esta cita en este momento.');
      return;
    }

    const amountText: string | null = this.total !== undefined ? new CurrencyPipe('en-US').transform(this.total, 'MXN', 'symbol', '1.2-2') : 'el monto acordado';

    const dialogData: RedirectWarningData = {
      message: `¿Confirmas que has recibido ${amountText} en efectivo para la cita #${eventId}? Esta acción no se puede deshacer.`
    };

    this.matDialog.open(RedirectWarningModalComponent, { data: dialogData })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.proceedWithCashConfirmation(eventId);
        }
      });
  }

  /**
   * Executes the backend call to confirm cash payment after user confirmation.
   */
  private proceedWithCashConfirmation(eventId: number): void {

  }


  onAddNurse(): void {
    this.matDialog.open<NursesCatalogModalComponent, CatalogDialog<Nurse, NurseParams>>(NursesCatalogModalComponent, {
      data: {
        isCompact: false,
        key: this.nurseCuid,
        mode: 'select',
        params: this.nurseParams(),
        view: this.nurseView(),
        title: `Seleccionar ${this.nurses.dictionary.plural}`,
        item: null
      },
      disableClose: true,
      hasBackdrop: true,
      panelClass: [ "window" ],
    });
  }

  onShareMedicalHistory(): void {
    const patientId: number | null = this.item()?.patient?.id || null;
    const doctorId: number | null = this.item()?.doctor?.id || null;

    if (!patientId || !doctorId) {
      console.error('Patient or doctor ID is null.');
      return
    }

    const dialogData: ClinicalHistoryConsentModalData = {
      doctorId: doctorId,
      patientId: patientId,
      currentConsent: this.consentStatus
    };

    this.matDialog.open(ClinicalHistoryConsentModalComponent, {
      data: dialogData,
      width: '400px',
      autoFocus: false
    }).afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.consentService.updateConsentStatus(doctorId, patientId, !this.consentStatus)
          .subscribe((updatedStatus: ClinicalHistoryVerification) => {
            console.log('Updated consent status:', updatedStatus);
            this.consentStatus = updatedStatus.hasAccess;
            this.toastr.success('Historial clínico compartido exitosamente.');
          });
      }
    });
  }

  deselectNurse(nurse: Nurse): void {
    if (this.item() && this.item()!.nurses) {
      this.nurses.setMultipleSelected(this.nurseCuid, this.item()!.nurses.filter((n): boolean => n.id !== nurse.id));
    } else {
      console.error("Item or nurses not found");
    }
  }

  openCancelConfirmation(): void {
    const event = this.item();
    if (!event || !event.id) {
      console.error('Cannot cancel event without a valid event object:', event);
      this.toastr.warning('No se puede cancelar la cita en este momento.');
      return;
    }

    const eventId = event.id;

    const dialogData: ConfirmationDialogData = {
      title: 'Confirmar Cancelación',
      message: `¿Estás seguro de que deseas cancelar la cita #${eventId}? Esta acción no se puede deshacer.`,
      confirmButtonText: 'Sí, Cancelar',
      confirmButtonColor: 'warn'
    };

    const dialogRef = this.matDialog.open(ConfirmationModalComponent, {
      data: dialogData,
      width: '400px'
    });

    dialogRef.afterClosed().pipe(
      filter(result => result === true),
      take(1)
    ).subscribe(() => {
      this.service.cancelEvent(eventId)
        .pipe(take(1))
        .subscribe({
          next: (updatedEvent) => {
            console.log('Event cancelled successfully:', updatedEvent);
            this.item.set(updatedEvent);
            this.toastr.success(`Cita #${eventId} cancelada exitosamente.`);
          },
          error: (err) => {
            console.error('Error cancelling event:', err);
            this.toastr.error('Error al cancelar la cita. Intente de nuevo.');
          }
        });
    });
  }
}
