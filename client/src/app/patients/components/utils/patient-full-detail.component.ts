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
import { createId } from "@paralleldrive/cuid2";
import { EventsCatalogComponent } from "src/app/events/components/events-catalog.component";
import { CalendarView } from "src/app/_models/events/eventTypes";
import { PhotoSize } from "src/app/_models/photos/photoTypes";


@Component({
  selector: 'div[patientFullDetail]',
  templateUrl: './patient-full-detail.component.html',
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

  router: Router = inject(Router);

  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Patient | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();

  activeTab: string = 'events';

  eventItem: WritableSignal<null> = signal(null);
  eventView: WritableSignal<View> = signal('inline' as View);
  eventParams: WritableSignal<EventParams> = signal(new EventParams(createId()));
  eventUseCard: WritableSignal<boolean> = signal(false);
  eventEmbedded: WritableSignal<boolean> = signal(false);
  eventIsCompact: WritableSignal<boolean> = signal(true);
  eventMode: WritableSignal<CatalogMode> = signal('view');
  eventCalendarView: WritableSignal<CalendarView> = signal('table');
  eventFiltersCollapsed: WritableSignal<boolean> = signal(true);

  constructor() {
    super(PatientsService);

    effect(() => {
      this.eventParams.set(new EventParams(this.key(), { patientId: this.item()!.id }));
      console.log('PatientFullDetailComponent', this.item(), this.eventParams());
    });

  }

  onSelectTab = (tab: string) => this.activeTab = tab;

  getEarnings = () => this.item()!.doctorPayments?.map(p => p.amount).reduce((a, b) => a! + b!, 0) ?? 0;

  getPendingPayments = () => {
    const total = this.item()!.doctorEvents?.map(e => e.service?.price!).reduce((a, b) => a + b, 0) ?? 0;
    const paid = this.item()!.doctorPayments?.map(p => p.amount).reduce((a, b) => a! + b!, 0) ?? 0;
    return total - paid;
  };
}
