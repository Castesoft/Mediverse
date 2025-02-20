import { CommonModule } from "@angular/common";
import { Component, effect, inject, model, ModelSignal, OnDestroy, signal } from "@angular/core";
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
import { EventsService } from "src/app/events/events.config";
import { EventsTableComponent } from "src/app/events/components/events-table/events-table.component";
import { CalendarView } from "src/app/_models/events/eventTypes";
import { EventsCalendarComponent } from "src/app/events/components/events-calendar.component";
import { GenericCatalogComponent } from "src/app/_shared/components/catalog-layout.component";
import { NursesService } from "src/app/nurses/nurses.config";
import { PatientsService } from "src/app/patients/patients.config";
import { ServicesService } from "src/app/services/services.config";
import { ClinicsService } from "src/app/clinics/clinics.config";
import {
  FilterConfiguration,
  FilterOrientation,
  FilterPosition,
  DrawerMode
} from "../../_models/base/filter-types";
import BaseCatalog from 'src/app/_models/base/components/extensions/baseCatalog';
import CatalogInputSignals from 'src/app/_models/base/components/interfaces/catalogInputSignals';
import { EventsTableDisplayRole } from "src/app/_models/events/eventConstants";

@Component({
  selector: '[eventsCatalog]',
  templateUrl: './events-catalog.component.html',
  standalone: true,
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
  ],
})
export class EventsCatalogComponent
  extends BaseCatalog<Event, EventParams, EventFiltersForm, EventsService>
  implements CatalogInputSignals<Event, EventParams> {
  private readonly clinics: ClinicsService = inject(ClinicsService);
  private readonly patients: PatientsService = inject(PatientsService);
  private readonly services: ServicesService = inject(ServicesService);
  private readonly nurses: NursesService = inject(NursesService);

  item: ModelSignal<Event | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<EventParams> = model.required();
  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration(
    FilterOrientation.VERTICAL,
    DrawerMode.SIDE,
    FilterPosition.START
  ));
  displayRole: ModelSignal<EventsTableDisplayRole> = model(EventsTableDisplayRole.PATIENT as EventsTableDisplayRole);

  calendarView: ModelSignal<CalendarView> = model.required<CalendarView>();
  filtersCollapsed: ModelSignal<boolean> = model.required<boolean>();

  filtersForm = signal(new EventFiltersForm());

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
        .setNurseOptions(this.nurses.options())
      ;
    });
  }
}
