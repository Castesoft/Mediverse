import { CommonModule } from "@angular/common";
import { Component, effect, inject, model, ModelSignal, signal, WritableSignal } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import BaseDetail from "src/app/_models/base/components/extensions/baseDetail";
import { CatalogMode, View } from "src/app/_models/base/types";
import { DetailInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { Patient } from "src/app/_models/patients/patient";
import { PatientFiltersForm } from "src/app/_models/patients/patientFiltersForm";
import { PatientParams } from "src/app/_models/patients/patientParams";
import { PatientsService } from "src/app/patients/patients.config";
import { ProfilePictureComponent } from "src/app/users/components/profile-picture/profile-picture.component";
import {
  ClinicalHistoryFormComponent
} from 'src/app/account/components/account-clinical-history/clinical-history-form/clinical-history-form.component';
import { EventParams } from "src/app/_models/events/eventParams";
import { EventsCatalogComponent } from "src/app/events/components/events-catalog.component";
import { CalendarView } from "src/app/_models/events/eventTypes";
import { PhotoSize } from "src/app/_models/photos/photoTypes";
import { Account } from "src/app/_models/account/account";
import { AccountService } from "src/app/_services/account.service";
import { ClinicalHistoryVerification } from "src/app/_models/clinicalHistoryVerification";
import { ClinicalHistoryConsentService } from "src/app/_services/clinical-history-consent.service";
import { Payment } from "src/app/_models/payments/payment";
import Event from "src/app/_models/events/event";


@Component({
  selector: 'div[patientFullDetail]',
  templateUrl: './patient-full-detail.component.html',
  styleUrls: [ './patient-full-detail.component.scss' ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ProfilePictureComponent,
    ClinicalHistoryFormComponent,
    EventsCatalogComponent,
  ]
})
export class PatientFullDetailComponent extends BaseDetail<Patient, PatientParams, PatientFiltersForm, PatientsService> implements DetailInputSignals<Patient> {
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly FormUse: typeof FormUse = FormUse;

  private readonly consentService: ClinicalHistoryConsentService = inject(ClinicalHistoryConsentService);
  private readonly accountsService: AccountService = inject(AccountService);

  router: Router = inject(Router);

  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Patient | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();

  activeTab: string = 'events';

  currentAccount: Account | null = null;
  consentStatus: boolean = false;

  eventItem: WritableSignal<null> = signal(null);
  eventView: WritableSignal<View> = signal('inline' as View);
  eventParams: WritableSignal<EventParams | null> = signal(null);
  eventUseCard: WritableSignal<boolean> = signal(false);
  eventEmbedded: WritableSignal<boolean> = signal(false);
  eventIsCompact: WritableSignal<boolean> = signal(true);
  eventMode: WritableSignal<CatalogMode> = signal('view');
  eventCalendarView: WritableSignal<CalendarView> = signal('table');
  eventFiltersCollapsed: WritableSignal<boolean> = signal(true);

  constructor() {
    super(PatientsService);

    effect(() => {
      console.log('PatientFullDetailComponent', this.item(), this.eventParams());

      this.currentAccount = this.accountsService.current();
      this.fetchConsentStatus();

      if (this.eventParams() === null) {
        this.setInitialParams();
      }
    });
  }

  private setInitialParams() {
    this.eventParams.set(new EventParams(this.key(), {
      patientId: this.item()!.id,
      doctorId: this.currentAccount!.id
    }));
  }

  private fetchConsentStatus(): void {
    const doctorId: number | null = this.currentAccount?.id || null;
    const patientId: number | null = this.item()?.id || null;

    if (!doctorId || !patientId) {
      console.error('fetchConsentStatus: userId or patientId is null');
      return;
    }

    this.consentService.getConsentStatus(doctorId, patientId)
      .subscribe((status: ClinicalHistoryVerification) => {
        console.log('status in fetchConsentStatus', status);
        this.consentStatus = status.hasAccess;
      });
  }

  onSelectTab(tab: string) {
    this.activeTab = tab;
  }

  getEarnings() {
    return this.item()!.doctorPayments?.map((p: Payment) => p.amount).reduce((a, b) => a! + b!, 0) ?? 0
  }

  getPendingPayments() {
    const total: number = this.item()!.doctorEvents?.map((e: Event) => e.service?.price!).reduce((a, b) => a + b, 0) ?? 0;
    const paid: number = this.item()!.doctorPayments?.map((p: Payment) => p.amount).reduce((a, b) => a! + b!, 0) ?? 0;
    return total - paid;
  };
}
