import {
  Component,
  effect,
  inject,
  model,
  ModelSignal,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QuillModule } from 'ngx-quill';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

import { DashboardModule } from "src/app/home/dashboard/dashboard.module";
import { BootstrapModule } from "src/app/_shared/bootstrap.module";
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';

import Event from "src/app/_models/events/event";
import { EventParams } from 'src/app/_models/events/eventParams';
import { EventFiltersForm } from 'src/app/_models/events/eventFiltersForm';
import { EventUpperTabs, EventLowerTabs } from 'src/app/_models/events/eventTypes';
import { CatalogMode, View } from 'src/app/_models/base/types';
import { FormUse } from 'src/app/_models/forms/formTypes';
import { BadRequest } from 'src/app/_models/forms/badRequest';

import { Prescription } from 'src/app/_models/prescriptions/prescription';
import { PrescriptionParams } from 'src/app/_models/prescriptions/prescriptionParams';

import BaseDetail from 'src/app/_models/base/components/extensions/baseDetail';
import { DetailInputSignals } from 'src/app/_models/forms/formComponentInterfaces';

import EvolutionForm from 'src/app/_models/events/detail/evolutionForm';
import NextStepForm from 'src/app/_models/events/detail/nextStepForm';

import { EventsService } from 'src/app/events/events.config';
import { CompactTableService } from 'src/app/_services/compact-table.service';
import { IconsService } from 'src/app/_services/icons.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';

import { EventSummaryComponent } from 'src/app/events/components/event-detail/event-summary/event-summary.component';
import { EventServicesSummaryComponent } from 'src/app/events/components/event-services-summary.component';
import {
  PrescriptionFormComponent
} from 'src/app/prescriptions/components/prescription-form/prescription-form.component';
import {
  PrescriptionsTableComponent
} from 'src/app/prescriptions/components/prescriptions-catalog/prescriptions-table/prescriptions-table.component';
import { PaymentsTableComponent } from 'src/app/_shared/components/payments-table/payments-table.component';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';

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
    PrescriptionsTableComponent,
    PrescriptionFormComponent,
    ProfilePictureComponent,
    PaymentsTableComponent,
    EventSummaryComponent,
  ]
})
export class EventWindowComponent extends BaseDetail<Event, EventParams, EventFiltersForm, EventsService> implements DetailInputSignals<Event>, OnInit {
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Event | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly compact = inject(CompactTableService);
  readonly icons = inject(IconsService);

  tax?: number;
  total?: number;

  upperTab: EventUpperTabs = 'evolucion';
  lowerTab: EventLowerTabs = 'general';
  summaryMode = true;
  summaryOrientation: 'vertical' | 'horizontal' = 'vertical';
  isEvolutionEditing = false;
  isNextStepsEditing = false;

  // Prescriptions signals
  prescriptionItem = signal<Prescription | null>(null);
  prescriptionKey = signal<string>(`${this.router.url}#event-detail`);
  prescriptionView = signal<View>('inline');
  prescriptionUse = signal<FormUse>('create');
  prescriptions = signal<Prescription[]>([]);
  prescriptionsCatalogMode = signal<CatalogMode>('readonly');
  prescriptionParams = signal<PrescriptionParams>(
    new PrescriptionParams(`${this.router.url}#event-detail`)
  );

  @ViewChild('staticTabs', { static: false }) staticTabs!: TabsetComponent;

  evolutionForm = new EvolutionForm();
  nextStepForm = new NextStepForm();

  constructor() {
    super(EventsService);

    const upperTabFromParams = this.route.snapshot.queryParams['superiorTab'] as EventUpperTabs;
    const lowerTabFromParams = this.route.snapshot.queryParams['inferiorTab'] as EventLowerTabs;

    if (upperTabFromParams) {
      this.upperTab = upperTabFromParams;
    }
    if (lowerTabFromParams) {
      this.lowerTab = lowerTabFromParams;
    }

    effect(() => {
      this.router.navigate([], {
        queryParams: {
          superiorTab: this.upperTab,
          inferiorTab: this.lowerTab
        },
        queryParamsHandling: 'merge'
      }).then(() => {});

      this.summaryMode = this.view() === 'modal';

      const event = this.item();
      if (event) {
        this.evolutionForm.controls.content.patchValue(event.evolution);
        this.nextStepForm.controls.content.patchValue(event.nextSteps);
      }
    });
  }

  ngOnInit(): void {
    const event = this.item();
    if (!event) return;

    if (event.service) {
      this.tax = event.service.price ? event.service.price * 0.16 : 0;
      this.total = event.service.price ? event.service.price + (this.tax ?? 0) : 0;
    }

    if (event.prescriptions) {
      this.prescriptions.set(event.prescriptions);
    }
  }

  onSubmitEvolution(): void {
    const event = this.item();
    if (!event || event.id == null) {
      throw new Error('Event or Event ID is null.');
    }

    const content = this.evolutionForm.controls.content.value;
    if (content === null) return;

    this.service.updateEvolution(event.id, content).subscribe({
      next: () => {
        this.isEvolutionEditing = false;
      },
      error: (error: BadRequest) => {
        this.evolutionForm.error = error;
      }
    });
  }

  onSubmitNextSteps(): void {
    const event = this.item();
    if (!event || event.id == null) {
      throw new Error('Event or Event ID is null.');
    }

    const content = this.nextStepForm.controls.content.value;
    if (content === null) return;

    this.service.updateNextSteps(event.id, content).subscribe({
      next: () => {
        this.isNextStepsEditing = false;
      },
      error: (error: BadRequest) => {
        this.nextStepForm.error = error;
      }
    });
  }

  onAddNurse(): void {
    console.log('Add nurse clicked');
  }
}
