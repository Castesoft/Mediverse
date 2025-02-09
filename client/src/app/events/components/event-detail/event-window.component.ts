import {
  Component,
  effect,
  inject,
  model,
  ModelSignal,
  OnInit,
  signal,
  ViewChild, WritableSignal
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

import { EventSummaryComponent } from 'src/app/events/components/event-detail/event-summary/event-summary.component';
import { EventServicesSummaryComponent } from 'src/app/events/components/event-services-summary.component';
import {
  PrescriptionFormComponent
} from 'src/app/prescriptions/components/prescription-form/prescription-form.component';
import { PaymentsTableComponent } from 'src/app/_shared/components/payments-table/payments-table.component';
import {
  PrescriptionsCatalogComponent
} from "src/app/prescriptions/components/prescriptions-catalog/prescriptions-catalog.component";
import { NursesCatalogModalComponent, NursesService } from "src/app/nurses/nurses.config";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import Nurse from "src/app/_models/nurses/nurse";
import { NurseParams } from "src/app/_models/nurses/nurseParams";
import { createId } from "@paralleldrive/cuid2";
import { MatDialog } from "@angular/material/dialog";
import { NurseDisplayCardComponent } from "../../../nurses/components/nurse-display-card.component";

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
    PaymentsTableComponent,
    EventSummaryComponent,
    PrescriptionsCatalogComponent,
    NurseDisplayCardComponent,
  ]
})
export class EventWindowComponent extends BaseDetail<Event, EventParams, EventFiltersForm, EventsService> implements OnInit, DetailInputSignals<Event>, OnInit {
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Event | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();

  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  readonly compact: CompactTableService = inject(CompactTableService);
  readonly nurses: NursesService = inject(NursesService);
  readonly icons: IconsService = inject(IconsService);
  readonly matDialog: MatDialog = inject(MatDialog);

  tax?: number;
  total?: number;

  upperTab: EventUpperTabs = 'evolucion';
  lowerTab: EventLowerTabs = 'general';

  summaryMode: boolean = true;
  summaryOrientation: 'vertical' | 'horizontal' = 'vertical';

  isEvolutionEditing: boolean = false;
  isNextStepsEditing: boolean = false;

  // Prescriptions signals
  prescriptionCuid: string = createId();
  prescriptionItem: WritableSignal<Prescription | null> = signal<Prescription | null>(null);
  prescriptionKey: WritableSignal<string> = signal<string>(this.prescriptionCuid);
  prescriptionView: WritableSignal<View> = signal<View>('inline');
  prescriptionUse: WritableSignal<FormUse> = signal<FormUse>(FormUse.CREATE);
  prescriptions: WritableSignal<Prescription[]> = signal<Prescription[]>([]);
  prescriptionsCatalogMode: WritableSignal<CatalogMode> = signal<CatalogMode>('readonly');
  prescriptionParams: WritableSignal<PrescriptionParams> = signal<PrescriptionParams>(new PrescriptionParams(this.prescriptionCuid));

  // Nurse signals
  nurseCuid: string = createId();
  nurseView: WritableSignal<View> = signal<View>('inline');
  nurseUse: WritableSignal<FormUse> = signal<FormUse>(FormUse.CREATE);
  nurseCatalogMode: WritableSignal<CatalogMode> = signal<CatalogMode>('select');
  nurseParams: WritableSignal<NurseParams> = signal<NurseParams>(new NurseParams(createId()));

  @ViewChild('staticTabs', { static: false }) staticTabs!: TabsetComponent;

  evolutionForm = new EvolutionForm();
  nextStepForm = new NextStepForm();

  constructor() {
    super(EventsService);

    effect((): void => {
      this.summaryMode = this.view() === 'modal';
    })

    effect((): void => {
      const event: Event | null = this.item();
      if (event) {
        this.evolutionForm.controls.content.patchValue(event.evolution);
        this.nextStepForm.controls.content.patchValue(event.nextSteps);
        this.isNextStepsEditing = event.nextSteps == null;
        this.isEvolutionEditing = event.evolution == null;
        this.updatePrescriptionParams(event.id);
      }
    })

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

  private updatePrescriptionParams(eventId: number | null): void {
    this.prescriptionParams.set(new PrescriptionParams(`${this.router.url}#event-detail`, { eventId }));
  }

  private subscribeToSelectedNurses(): void {
    this.nurses.multipleSelected$(this.nurseCuid).subscribe((selectedNurses) => {
      this.item.update((pastValue): Event | null => {
        return pastValue ? { ...pastValue, nurses: selectedNurses } : null;
      })
    })
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
      this.tax = event.service.price ? event.service.price * 0.16 : 0;
      this.total = event.service.price ? event.service.price + (this.tax ?? 0) : 0;
    }

    if (event.prescriptions) this.prescriptions.set(event.prescriptions);
    if (event.createdAt) prescriptionDefaultValues.date = new Date(event.createdAt);
    if (event.patient) prescriptionDefaultValues.patient = event.patient;
    if (event.clinic) prescriptionDefaultValues.clinic = event.clinic;
    if (event.id) prescriptionDefaultValues.event.id = event.id;
    if (event.doctor) prescriptionDefaultValues.doctor = event.doctor;
    if (event.nurses) this.nurses.setMultipleSelected(this.nurseCuid, event.nurses);

    this.prescriptionItem.update(_ => prescriptionDefaultValues);
  }

  onSubmitEvolution(): void {
    const event: Event | null = this.item();
    if (!event || event.id == null) {
      throw new Error('Event or Event ID is null.');
    }

    const content = this.evolutionForm.controls.content.value;
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

    const content = this.nextStepForm.controls.content.value;
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
  };

  deselectNurse(nurse: Nurse): void {
    if (this.item() && this.item()!.nurses) {
      this.nurses.setMultipleSelected(this.nurseCuid, this.item()!.nurses.filter((n): boolean => n.id !== nurse.id));
    } else {
      console.error("Item or nurses not found");
    }
  }
}
