import { CommonModule } from "@angular/common";
import { Component, DestroyRef, effect, inject, model, ModelSignal, signal, WritableSignal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { CatalogMode, View } from "src/app/_models/base/types";
import Event from "src/app/_models/events/event";
import { EventFiltersForm } from "src/app/_models/events/eventFiltersForm";
import { EventParams } from "src/app/_models/events/eventParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { EventsTableComponent } from "src/app/events/components/events-table/events-table.component";
import { CalendarView } from "src/app/_models/events/eventTypes";
import { EventsCalendarComponent } from "src/app/events/components/events-calendar.component";
import { GenericCatalogComponent } from "src/app/_shared/components/catalog-layout.component";
import { NursesService } from "src/app/nurses/nurses.config";
import { PatientsService } from "src/app/patients/patients.config";
import { ServicesService } from "src/app/services/services.config";
import { ClinicsService } from "src/app/clinics/clinics.config";
import { DrawerMode, FilterConfiguration, FilterOrientation, FilterPosition } from "src/app/_models/base/filter-types";
import BaseCatalog from 'src/app/_models/base/components/extensions/baseCatalog';
import CatalogInputSignals from 'src/app/_models/base/components/interfaces/catalogInputSignals';
import { EventsTableDisplayRole } from "src/app/_models/events/eventConstants";
import { EventMonthDayCell } from "src/app/_models/event-month-day-cell/eventMonthDayCell";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EventsService } from "src/app/events/events.service";
import {
  CatalogLayoutSkeletonComponent
} from "src/app/_shared/components/catalog-layout-skeleton/catalog-layout-skeleton.component";

@Component({
  selector: '[eventsCatalog]',
  templateUrl: './events-catalog.component.html',
  imports: [
    FontAwesomeModule,
    EventsTableComponent,
    CommonModule,
    RouterModule,
    ControlsModule,
    TablesModule,
    CdkModule,
    MaterialModule,
    Forms2Module,
    EventsCalendarComponent,
    GenericCatalogComponent,
    CatalogLayoutSkeletonComponent,
  ],
})
export class EventsCatalogComponent extends BaseCatalog<Event, EventParams, EventFiltersForm, EventsService> implements CatalogInputSignals<Event, EventParams> {
  private readonly services: ServicesService = inject(ServicesService);
  private readonly patients: PatientsService = inject(PatientsService);
  private readonly clinics: ClinicsService = inject(ClinicsService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly nurses: NursesService = inject(NursesService);

  item: ModelSignal<Event | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<EventParams> = model.required();
  useCard: ModelSignal<boolean> = model(true);
  embedded: ModelSignal<boolean> = model(false);

  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration(
    FilterOrientation.VERTICAL,
    DrawerMode.SIDE,
    FilterPosition.START
  ));

  displayRole: ModelSignal<EventsTableDisplayRole> = model(EventsTableDisplayRole.PATIENT as EventsTableDisplayRole);

  calendarView: ModelSignal<CalendarView> = model.required<CalendarView>();
  filtersCollapsed: ModelSignal<boolean> = model.required<boolean>();

  filtersForm: WritableSignal<EventFiltersForm> = signal(new EventFiltersForm());

  calendarList: EventMonthDayCell[] = [];


  constructor() {
    super(EventsService, EventFiltersForm);

    this.clinics.getOptions().subscribe();
    this.patients.getOptions().subscribe();
    this.services.getOptions().subscribe();
    this.nurses.getOptions().subscribe();

    effect(() => {
      this.filtersForm()
        .setValidation(this.validation.active())
        .setClinicOptions(this.clinics.options())
        .setPatientOptions(this.patients.options())
        .setServiceOptions(this.services.options())
        .setNurseOptions(this.nurses.options());

      if (this.calendarView() === 'calendar') {
        this.service.getMonthViewPartial(this.key(), this.params()).subscribe();
      }
    });

    this.subscribeToEventMonthDayCell();
  }

  setCalendarViewQueryParam(view: CalendarView): void {
    this.router.navigate([], {
      queryParams: {
        view: view,
      },
      queryParamsHandling: 'merge',
    }).catch(console.error);
  }

  private subscribeToEventMonthDayCell(): void {
    this.service.eventMonthDayCells$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((eventMonthDayCells: EventMonthDayCell[]) => {
      this.calendarList = eventMonthDayCells;
    });
  }
}
