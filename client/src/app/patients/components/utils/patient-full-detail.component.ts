import { CommonModule } from "@angular/common";
import { Component, effect, inject, model, ModelSignal, signal } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import BaseDetail from "src/app/_models/base/components/extensions/baseDetail";
import { CatalogMode, View } from "src/app/_models/base/types";
import { DetailInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import Patient from "src/app/_models/patients/patient";
import { PatientFiltersForm } from "src/app/_models/patients/patientFiltersForm";
import { PatientParams } from "src/app/_models/patients/patientParams";
import { PatientsService } from "src/app/patients/patients.config";
import { ProfilePictureComponent } from "src/app/users/components/profile-picture/profile-picture.component";
import { ClinicalHistoryFormComponent } from 'src/app/account/components/account-clinical-history/clinical-history-form/clinical-history-form.component';
import { PaymentsTableComponent } from 'src/app/_shared/components/payments-table/payments-table.component';
import { EventParams } from "src/app/_models/events/eventParams";
import { createId } from "@paralleldrive/cuid2";
import { EventsCatalogComponent } from "src/app/events/components/events-catalog.component";
import { CalendarView } from "src/app/_models/events/eventTypes";


@Component({
  selector: 'div[patientFullDetail]',
  templateUrl: './patient-full-detail.component.html',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, RouterModule, ProfilePictureComponent,
    ClinicalHistoryFormComponent, PaymentsTableComponent, EventsCatalogComponent,
   ]
})
export class PatientFullDetailComponent
  extends BaseDetail<Patient, PatientParams, PatientFiltersForm, PatientsService>
  implements DetailInputSignals<Patient>
{
  router = inject(Router);

  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Patient | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();

  activeTab = 'events';

  eventItem = signal(null);
  eventView = signal<View>('inline');
  eventParams = signal<EventParams>(new EventParams(createId()));
  eventIsCompact = signal(true);
  eventMode = signal<CatalogMode>('view');
  eventCalendarView = signal<CalendarView>('table');
  eventFiltersCollapsed = signal(true);

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
