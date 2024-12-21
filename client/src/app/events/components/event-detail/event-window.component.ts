import { Component, effect, inject, model, ModelSignal, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import Event from "src/app/_models/events/event";
import { CommonModule } from "@angular/common";
import { BootstrapModule } from "src/app/_shared/bootstrap.module";
import { DashboardModule } from "src/app/home/dashboard/dashboard.module";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EventServicesSummaryComponent } from 'src/app/events/components/event-services-summary.component';
import { QuillModule } from 'ngx-quill';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { PrescriptionFormComponent } from 'src/app/prescriptions/components/prescription-form/prescription-form.component';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { PrescriptionsTableComponent } from 'src/app/prescriptions/components/prescriptions-catalog/prescriptions-table/prescriptions-table.component';
import { CatalogMode, View } from 'src/app/_models/base/types';
import { FormUse } from 'src/app/_models/forms/formTypes';
import { IconsService } from 'src/app/_services/icons.service';
import { PaymentsTableComponent } from 'src/app/_shared/components/payments-table/payments-table.component';
import { EventsService } from 'src/app/events/events.config';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';
import { DetailInputSignals } from 'src/app/_models/forms/formComponentInterfaces';
import { EventParams } from 'src/app/_models/events/eventParams';
import BaseDetail from 'src/app/_models/base/components/extensions/baseDetail';
import { EventFiltersForm } from 'src/app/_models/events/eventFiltersForm';
import { EventSummaryComponent } from 'src/app/events/components/event-detail/event-summary/event-summary.component';
import { EventLowerTabs, EventUpperTabs } from 'src/app/_models/events/eventTypes';
import EvolutionForm from 'src/app/_models/events/detail/evolutionForm';
import NextStepForm from 'src/app/_models/events/detail/nextStepForm';
import { BadRequest } from 'src/app/_models/forms/badRequest';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import { Prescription } from 'src/app/_models/prescriptions/prescription';
import { CompactTableService } from 'src/app/_services/compact-table.service';
import { PrescriptionParams } from 'src/app/_models/prescriptions/prescriptionParams';

@Component({
  selector: 'div[eventWindow]',
  templateUrl: './event-window.component.html',
  styleUrls: ['./event-window.component.scss'],
  standalone: true,
  imports: [
    RouterModule, BootstrapModule, CommonModule, DashboardModule, FontAwesomeModule, FormsModule, Forms2Module,
    EventServicesSummaryComponent, ProfilePictureComponent, PaymentsTableComponent, QuillModule, ReactiveFormsModule,
    PrescriptionFormComponent, TemplateModule, PrescriptionsTableComponent, ProfilePictureComponent, EventSummaryComponent,
  ]
})
export class EventWindowComponent
  extends BaseDetail<Event, EventParams, EventFiltersForm, EventsService>
  implements DetailInputSignals<Event>, OnInit
{
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Event | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private eventService = inject(EventsService);
  private snackbarService = inject(SnackbarService);
  icons = inject(IconsService);
  compact = inject(CompactTableService);

  tax?: number;
  total?: number;

  upperTab = signal<EventUpperTabs>('evolucion');
  lowerTab = signal<EventLowerTabs>('general');
  summaryMode = signal<boolean>(true);
  summaryOrientation = signal<'vertical' | 'horizontal'>('vertical');
  isEvolutionEditing = signal<boolean>(false);
  isNextStepsEditing = signal<boolean>(false);

  prescriptionItem = signal(null);
  prescriptionKey = signal<string>(`${this.router.url}#event-detail`);
  prescriptionView = signal<View>('inline');
  prescriptionUse = signal<FormUse>('create');
  prescriptions = signal<Prescription[]>([]);
  prescriptionsCatalogMode = signal<CatalogMode>('readonly');
  prescriptionParams = signal<PrescriptionParams>(new PrescriptionParams(`${this.router.url}#event-detail`));

  @ViewChild('staticTabs', {static: false}) staticTabs!: TabsetComponent;

  evolutionForm = new EvolutionForm();
  nextStepForm = new NextStepForm();

  constructor() {
    super(EventsService);

    const upperTab: EventUpperTabs | undefined = this.route.snapshot.queryParams['superiorTab'];
    const lowerTab: EventLowerTabs | undefined = this.route.snapshot.queryParams['inferiorTab'];

    if (upperTab !== undefined) {
      this.upperTab.set(upperTab);
    }

    if (lowerTab !== undefined) {
      this.lowerTab.set(lowerTab);
    }

    effect(() => {
      this.router.navigate([], {queryParams: {
        superiorTab: this.upperTab(),
        inferiorTab: this.lowerTab()
      }, queryParamsHandling: 'merge'});

      if (this.view() === 'modal') {
        this.summaryMode.set(true);
      } else {
        this.summaryMode.set(false);
      }

      const event: Event | null = this.item();

      if (event) {
        this.evolutionForm.controls.content.patchValue(event.evolution);
        this.nextStepForm.controls.content.patchValue(event.nextSteps);
      }

    });
  }

  ngOnInit() {
    if (this.item() && this.item()!.service) {
      this.tax = this.item()!.service!.price! * 0.16;
      this.total = this.item()!.service!.price! + this.tax;

      this.prescriptions.set(this.item()!.prescriptions);
    }
  }

  onSubmitEvolution() {
    const event: Event | null = this.item();

    if (event !== null) {
      if (event.id === null) throw new Error('Event ID is null');

      const content: string | null = this.evolutionForm.controls.content.value;

      if (content !== null) {
        this.service.updateEvolution(event.id, content).subscribe({
          next: response => {
            this.isEvolutionEditing.set(false);
          },
          error: (error: BadRequest) => {
            this.evolutionForm.error = error;
          }
        })
      }
    }
  }

  onSubmitNextSteps() {
    const event: Event | null = this.item();

    if (event !== null) {
      if (event.id === null) throw new Error('Event ID is null');

      const content: string | null = this.nextStepForm.controls.content.value;

      if (content !== null) {
        this.service.updateNextSteps(event.id, content).subscribe({
          next: response => {
            this.isNextStepsEditing.set(false);
          },
          error: (error: BadRequest) => {
            this.nextStepForm.error = error;
          }
        })
      }
    }
  }

  onAddNurse() {
    // Implement the logic to add a new nurse to the event
    console.log('Add nurse clicked');
  }
}
