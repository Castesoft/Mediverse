import { CdkAccordionItem } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  model,
  ModelSignal,
  signal,
  Signal,
  viewChild,
  WritableSignal
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ControlsModule } from 'src/app/_forms/controls.module';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import BaseForm from 'src/app/_models/base/components/extensions/baseForm';
import { View } from 'src/app/_models/base/types';
import Event from 'src/app/_models/events/event';
import { EventFormPayload, eventFormSteps } from 'src/app/_models/events/eventConstants';
import { EventFiltersForm } from 'src/app/_models/events/eventFiltersForm';
import { EventForm } from 'src/app/_models/events/eventForm';
import { EventParams } from 'src/app/_models/events/eventParams';
import { EventFormSteps } from 'src/app/_models/events/eventTypes';
import { FormInputSignals } from 'src/app/_models/forms/formComponentInterfaces';
import { FormUse } from 'src/app/_models/forms/formTypes';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { ClinicsService } from 'src/app/clinics/clinics.config';
import { ClinicFormComponent } from 'src/app/clinics/clinic-form.component';
import { NursesService } from 'src/app/nurses/nurses.config';
import { PatientFormComponent, PatientsService } from 'src/app/patients/patients.config';
import { ServiceFormComponent, ServicesService } from 'src/app/services/services.config';
import { AccountService } from "src/app/_services/account.service";
import { EventsService } from "src/app/events/events.service";

@Component({
  selector: "[eventForm]",
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ControlsModule,
    Forms2Module,
    MaterialModule,
    CdkModule,
    PatientFormComponent,
    ServiceFormComponent,
    ClinicFormComponent,
  ]
})
export class EventFormComponent extends BaseForm<Event, EventParams, EventFiltersForm, EventForm, EventsService> implements FormInputSignals<Event> {
  private readonly accountService: AccountService = inject(AccountService);

  item: ModelSignal<Event | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();

  patients: PatientsService = inject(PatientsService);
  clinics: ClinicsService = inject(ClinicsService);
  services: ServicesService = inject(ServicesService);
  nurses: NursesService = inject(NursesService);

  readonly fromWrapper: WritableSignal<boolean> = signal<boolean>(false);

  patientUse: FormUse = FormUse.CREATE;
  serviceUse: FormUse = FormUse.CREATE;
  clinicUse: FormUse = FormUse.CREATE;

  patientKey: string = this.router.url;
  serviceKey: string = this.router.url;
  clinicKey: string = this.router.url;

  patientView: View = 'inline';
  serviceView: View = 'inline';
  clinicView: View = 'inline';

  patientAccordion: Signal<CdkAccordionItem> = viewChild.required<CdkAccordionItem>('patientAccordion');
  serviceAccordion: Signal<CdkAccordionItem> = viewChild.required<CdkAccordionItem>('serviceAccordion');
  clinicAccordion: Signal<CdkAccordionItem> = viewChild.required<CdkAccordionItem>('clinicAccordion');

  patientItem: null = null;
  serviceItem: null = null;
  clinicItem: null = null;

  patientPanelOpen: boolean = false;
  servicePanelOpen: boolean = false;
  clinicPanelOpen: boolean = false;

  selectedIndex: number = 0;

  constructor() {
    super(EventsService, EventForm);

    const step: EventFormSteps | undefined = this.route.snapshot.queryParams['paso'];

    if (step === undefined) {
      this.selectedIndex = 0;
    } else {
      switch (step) {
        case 'paciente':
          this.selectedIndex = 0;
          break;
        case 'horario':
          this.selectedIndex = 1;
          break;
        case 'servicio':
          this.selectedIndex = 2;
          break;
        case 'especialistas':
          this.selectedIndex = 3;
          break;
        case 'clinica':
          this.selectedIndex = 4;
          break;
        default:
          this.selectedIndex = 0;
          break;
      }
    }

    this.patients.getOptions().subscribe();
    this.clinics.getOptions().subscribe();
    this.services.getOptions().subscribe();
    this.nurses.getOptions().subscribe();

    effect(() => {
      this.router.navigate([], { queryParams: { paso: eventFormSteps[this.selectedIndex] } }).then((): void => {});

      this.form
        .setUse(this.use())
        .setValidation(this.validation.active())
        .setClinicOptions(this.clinics.options())
        .setPatientOptions(this.patients.options())
        .setServiceOptions(this.services.options())
        .setNurseOptions(this.nurses.options());

      if (this.accountService.current()) {
        this.form.controls.doctor.patchValue(this.accountService.current() as any);
      }

      if (this.item() !== null) this.form.patchValue(this.item()! as any);
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

  handleClinicPanelClick(event: any) {
    if (this.form.hasClinic) {
      event.stopPropagation();
    } else {
      this.clinicAccordion()?.open();
    }
  }

  customSubmit(): void {
    const patientId: number | null = this.form.controls.patient.getRawValue().id;
    if (patientId === null) {
      console.error('Patient is required');
      return;
    }

    const nurseIds: number[] = this.form.controls.nurses.getRawValue().map((nurse: any) => nurse.id);

    const serviceId: number | null = this.form.controls.service.getRawValue().id;
    if (serviceId === null) {
      console.error('Service is required');
      return;
    }

    const clinicId: number | null = this.form.controls.clinic?.controls?.select.getRawValue()?.id || null;
    if (clinicId === null) {
      console.error('Clinic is required');
      return;
    }

    const dateFrom: Date | null = new Date(this.form.controls.dateFrom.getRawValue() as any);
    const dateTo: Date | null = new Date(this.form.controls.dateTo.getRawValue() as any);

    if (dateFrom === null || dateTo === null) {
      console.error('Date is required');
      return;
    }

    const fromHours: number = new Date(this.form.controls.timeFrom.getRawValue() as any).getHours();
    const fromMinutes: number = new Date(this.form.controls.timeFrom.getRawValue() as any).getMinutes();


    const toHours: number = new Date(this.form.controls.timeTo.getRawValue() as any).getHours();
    const toMinutes: number = new Date(this.form.controls.timeTo.getRawValue() as any).getMinutes();

    const combinedDateFrom = new Date(
      dateFrom.getFullYear(),
      dateFrom.getMonth(),
      dateFrom.getDate(),
      fromHours,
      fromMinutes,
    );

    const combinedDateTo = new Date(
      dateTo.getFullYear(),
      dateTo.getMonth(),
      dateTo.getDate(),
      toHours,
      toMinutes,
    );

    const payload: EventFormPayload = {
      patientId: patientId,
      nurseIds: nurseIds,
      serviceId: serviceId,
      clinicId: clinicId,
      allDay: false,
      dateFrom: combinedDateFrom,
      dateTo: combinedDateTo,
    }

    this.service.createRaw(payload).subscribe({
      next: (event: Event): void => {
        this.matSnackBar.open('Evento creado', 'Cerrar', { duration: 5000 });
        this.router.navigate([ '/events', event.id ]).then(() => {});
      },
      error: (error: any): void => {
        console.error('Error creating event', error);
        this.matSnackBar.open('Error creando evento', 'Cerrar', { duration: 5000 });
      }
    })
  }
}
