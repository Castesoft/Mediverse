import { CommonModule } from "@angular/common";
import { Component, effect, inject, model, ModelSignal } from "@angular/core";
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
export class EventsCatalogComponent {
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

  calendarView: ModelSignal<CalendarView> = model.required<CalendarView>();
  filtersCollapsed: ModelSignal<boolean> = model.required<boolean>();

  service: EventsService = inject(EventsService);
  form = model(new EventFiltersForm());

  constructor() {
    effect((): void => this.setOptions())
  }

  private setOptions(): void {
    this.clinics.getOptions().subscribe();
    this.patients.getOptions().subscribe();
    this.services.getOptions().subscribe();
    this.nurses.getOptions().subscribe();

    this.form().controls.clinics.selectOptions = this.clinics.options();
    this.form().controls.patients.selectOptions = this.patients.options();
    this.form().controls.services.selectOptions = this.services.options();
    this.form().controls.nurses.selectOptions = this.nurses.options();
  }
}
