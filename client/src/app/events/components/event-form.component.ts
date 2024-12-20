import { CdkAccordionItem } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import { Component, ModelSignal, model, effect, inject, signal, viewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ControlsModule } from 'src/app/_forms/controls.module';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import BaseForm from 'src/app/_models/base/components/extensions/baseForm';
import { View } from 'src/app/_models/base/types';
import Event from 'src/app/_models/events/event';
import { eventFormSteps } from 'src/app/_models/events/eventConstants';
import { EventFiltersForm } from 'src/app/_models/events/eventFiltersForm';
import { EventForm } from 'src/app/_models/events/eventForm';
import { EventParams } from 'src/app/_models/events/eventParams';
import { EventFormSteps } from 'src/app/_models/events/eventTypes';
import { FormInputSignals } from 'src/app/_models/forms/formComponentInterfaces';
import { FormUse } from 'src/app/_models/forms/formTypes';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { ClinicFormComponent, ClinicsService } from 'src/app/clinics/clinics.config';
import { EventsService } from 'src/app/events/events.config';
import { NurseFormComponent, NursesService } from 'src/app/nurses/nurses.config';
import { PatientFormComponent, PatientsService } from 'src/app/patients/patients.config';
import { ServiceFormComponent, ServicesService } from 'src/app/services/services.config';

@Component({
  selector: "[eventForm]",
  // template: ``,
  templateUrl: './event-form.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ControlsModule, Forms2Module, MaterialModule, CdkModule,
    PatientFormComponent, NurseFormComponent, ServiceFormComponent, ClinicFormComponent,
  ]
})
export class EventFormComponent
  extends BaseForm<Event, EventParams, EventFiltersForm, EventForm, EventsService>
  implements FormInputSignals<Event> {
  item: ModelSignal<Event | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();

  patients = inject(PatientsService);
  clinics = inject(ClinicsService);
  services = inject(ServicesService);
  nurses = inject(NursesService);

  readonly fromWrapper = signal<boolean>(false);

  readonly patientPanelOpen = signal(false);
  readonly patientItem = signal(null);
  readonly patientView = signal<View>('inline');
  readonly patientUse = signal<FormUse>('create');
  readonly patientKey = signal<string>(this.router.url);
  patientAccordion = viewChild.required<CdkAccordionItem>('patientAccordion');
  readonly servicePanelOpen = signal(false);
  readonly serviceItem = signal(null);
  readonly serviceView = signal<View>('inline');
  readonly serviceUse = signal<FormUse>('create');
  readonly serviceKey = signal<string>(this.router.url);
  serviceAccordion = viewChild.required<CdkAccordionItem>('serviceAccordion');
  readonly nursesPanelOpen = signal(false);
  nursesAccordion = viewChild.required<CdkAccordionItem>('nursesAccordion');
  readonly clinicPanelOpen = signal(false);
  readonly clinicItem = signal(null);
  readonly clinicView = signal<View>('inline');
  readonly clinicUse = signal<FormUse>('create');
  readonly clinicKey = signal<string>(this.router.url);
  clinicAccordion = viewChild.required<CdkAccordionItem>('clinicAccordion');

  selectedIndex = signal(0);

  constructor() {
    super(EventsService, EventForm);

    const step: EventFormSteps | undefined = this.route.snapshot.queryParams['paso'];

    if (step === undefined) {
      this.selectedIndex.set(0);
    } else {

      switch (step) {
        case 'paciente':
          this.selectedIndex.set(0);
          break;
        case 'horario':
          this.selectedIndex.set(1);
          break;
        case 'servicio':
          this.selectedIndex.set(2);
          break;
        case 'especialistas':
          this.selectedIndex.set(3);
          break;
        case 'clinica':
          this.selectedIndex.set(4);
          break;
        default:
          this.selectedIndex.set(0);
          break;
      }
    }

    this.patients.getOptions().subscribe();
    this.clinics.getOptions().subscribe();
    this.services.getOptions().subscribe();
    this.nurses.getOptions().subscribe();

    effect(() => {
      this.router.navigate([], { queryParams: { paso: eventFormSteps[this.selectedIndex()] } });

      this.form
        .setUse(this.use())
        .setValidation(this.validation.active())
        .setClinicOptions(this.clinics.options())
        .setPatientOptions(this.patients.options())
        .setServiceOptions(this.services.options())
        .setNurseOptions(this.nurses.options())
      ;

      console.log('FORM', this.form);


      const value = this.item();

      if (value !== null) {
        this.form.patchValue(value);
      }
    });
  }

  handlePatientPanelClick(event: any) {
    if (this.form.hasPatient) {
      event.stopPropagation();
    } else {
      this.patientAccordion()?.open();
    }
  }

  handleServicePanelClick(event: any) {
    if (this.form.hasService) {
      event.stopPropagation();
    } else {
      this.serviceAccordion()?.open();
    }
  }

  handleNursesPanelClick(event: any) {
    if (this.form.hasNurses) {
      event.stopPropagation();
    } else {
      this.nursesAccordion()?.open();
    }
  }

  handleClinicPanelClick(event: any) {
    if (this.form.hasClinic) {
      event.stopPropagation();
    } else {
      this.clinicAccordion()?.open();
    }
  }

}
