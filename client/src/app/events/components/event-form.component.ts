import { CdkAccordion, CdkAccordionItem } from '@angular/cdk/accordion';
import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  input,
  output,
  signal,
  viewChild,
  model,
} from '@angular/core';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CreateForm, EditForm, DetailForm, EventDoctorFields } from 'src/app/_models/event';
import { Event } from "src/app/_models/events/event";
import { BadRequest, FormUse, Role, View } from 'src/app/_models/types';
import { User } from "src/app/_models/users/user";
import { IconsService } from 'src/app/_services/icons.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CurrencyPipe, DatePipe, JsonPipe } from '@angular/common';
import { ControlsModule } from 'src/app/_forms/controls.module';
import { EventsService } from 'src/app/_services/events.service';
import { UsersService } from "src/app/users/users.config";
import { MaterialModule } from 'src/app/_shared/material.module';
import { calcDateDiff } from 'src/app/_utils/util';
import { UserCardCompactComponent } from 'src/app/users/components/user-card-compact.component';
import { UserFormComponent } from 'src/app/users/components/user-form.component';
import {
  UsersCatalogComponent,
  UsersListSelectComponent,
} from 'src/app/users/components/users-catalog.component';
import { createId } from '@paralleldrive/cuid2';
import { PatientSelectTypeaheadComponent } from "src/app/_shared/components/patient-select-typeahead.component";
import { AddressesService } from 'src/app/addresses/addresses.config';
import { ServiceCardCompactComponent } from 'src/app/services/components/service-card-compact.component';
import { ServiceFormComponent, ServicesService } from 'src/app/services/services.config';
import { Address } from 'cluster';
import { Service } from "src/app/_models/services/service";

@Component({
  host: { class: 'pb-3' },
  selector: 'div[eventForm]',
  templateUrl: './event-form.component.html',
  standalone: true,
  imports: [
    FontAwesomeModule,
    AlertModule,
    RouterModule,
    JsonPipe,
    ControlsModule,
    MaterialModule,
    UserCardCompactComponent,
    DatePipe,
    UserFormComponent,
    CdkAccordion,
    CdkAccordionItem,
    ServiceCardCompactComponent,
    ServiceFormComponent,
    CurrencyPipe,
    UsersCatalogComponent,
    UsersListSelectComponent,
    PatientSelectTypeaheadComponent,
  ],
})
export class EventFormComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private formsvalidation = inject(ValidationService);
  private router = inject(Router);
  snackbarService = inject(SnackbarService)
  eventsService = inject(EventsService);
  icons = inject(IconsService);
  usersService = inject(UsersService);
  servicesService = inject(ServicesService);
  addressesService = inject(AddressesService);

  id = input.required<number | null>();
  use = model.required<FormUse>();
  view = model.required<View>();
  role = model.required<Role>();
  key = input<string>();
  dateFrom = input<Date>();
  dateTo = input<Date>();

  formId = output<string>();
  event = output<Event>();

  item: Event | null = null;
  selectPatientKey = createId();
  selectServiceKey = createId();
  selectNursesKey = createId();
  selectClinicKey = createId();
  _key = createId();

  readonly patientPanelOpen = signal(false);
  patientAccordion = viewChild<CdkAccordionItem>('patientAccordion');
  readonly servicePanelOpen = signal(false);
  serviceAccordion = viewChild<CdkAccordionItem>('serviceAccordion');
  readonly nursesPanelOpen = signal(false);
  nursesAccordion = viewChild<CdkAccordionItem>('nursesAccordion');
  readonly clinicPanelOpen = signal(false);
  clinicAccordion = viewChild<CdkAccordionItem>('clinicAccordion');

  form!: CreateForm | EditForm | DetailForm;
  returnUrl: string | null = null;
  private ngUnsubscribe = new Subject<void>();

  isDetail = false;
  patient?: User;
  service?: Service;
  nurses?: User[];
  address?: Address;
  doctorFields?: EventDoctorFields;

  constructor() {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (params) => {
        if (params['returnUrl']) this.returnUrl = params['returnUrl'];
      },
    });
  }

  handlePatientPanelClick(event: any) {
    if (this.patient) {
      event.stopPropagation();
    } else {
      this.patientAccordion()?.open();
    }
  }

  handleServicePanelClick(event: any) {
    if (this.service) {
      event.stopPropagation();
    } else {
      this.serviceAccordion()?.open();
    }
  }

  handleNursesPanelClick(event: any) {
    if (this.nurses) {
      event.stopPropagation();
    } else {
      this.nursesAccordion()?.open();
    }
  }

  ngOnInit(): void {
    if (this.key()) this._key = this.key()!;

    if (this.use() === 'create') {
      this.form = new CreateForm();
    } else if (this.use() === 'edit') {
      this.form = new EditForm();
    } else if (this.use() === 'detail') {
      this.form = new DetailForm();
    }

    // this.usersService.selected$(this.selectPatientKey).subscribe({
    //   next: (user) => {
    //     this.patient = user;
    //     if (user) {
    //       this.patientAccordion()?.close();
    //       this.form.group.get('patientId')!.setValue(user.id);
    //     }
    //   },
    // });

    // this.servicesService.selected$(this.selectServiceKey).subscribe({
    //   next: (service) => {
    //     this.service = service;
    //     if (service) {
    //       this.serviceAccordion()?.close();
    //       this.form.group.get('serviceId')!.setValue(service.id);
    //     }
    //   },
    // });

    this.eventsService.getDoctorFields().subscribe({
      next: (fields) => {
        this.doctorFields = fields;
      },
    });

    // this.usersService.multipleSelected$(this.selectNursesKey).subscribe({
    //   next: (nurses) => {
    //     this.nurses = nurses;
    //     console.log(nurses?.map((n) => n.id).join(','));
    //     if (nurses) {
    //       this.nursesAccordion()?.close();
    //       this.form.group
    //         .get('nursesIds')!
    //         .setValue(nurses.map((n) => n.id).join(','));
    //     }
    //   },
    // });

    this.formId.emit(this.form.id);

    if (this.use() === 'edit' || this.use() === 'detail') {
      this.eventsService.current$.subscribe({
        next: (item) => {
          if (item) {
            this.item = item;
            if (this.form instanceof EditForm) this.form.patchValues(item);
            if (this.form instanceof DetailForm) this.form.patchValues(item);
            if (this.form instanceof CreateForm) {
              this.form.group.patchValue(item);
            }
          }
        },
      });
    }

    if (this.use() === 'create') {
      this.dateFrom() &&
        this.form.group.get('dateTime')!.get('dateFrom')!.setValue(this.dateFrom());
      this.dateTo() &&
        this.form.group.get('dateTime')!.get('dateTo')!.setValue(this.dateTo());
      if (this.dateFrom() && this.dateTo()) {
        if (calcDateDiff(this.dateFrom()!, this.dateTo()!) !== 0) {
          this.form.group.get('dateTime')!.get('allDay')!.setValue(true);
        } else {
          this.form.group.get('dateTime')!.get('allDay')!.setValue(false);
        }
      }
    }

    if (this.use() === 'detail') {
      this.isDetail = true;
    }

    this.formsService.mode$.subscribe({
      next: (mode) => {
        this.form.validation = mode;
        this.applyValidationsToForm(mode);
      },
    });
  }

  handleClinicChange() {
    this.clinicAccordion()?.close();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    this.form.submitted = true;
    if (this.use() === 'create') {
      this.create();
    } else {
      this.update();
    }
  }

  private applyValidationsToForm(mode: boolean) {
    if (this.form) {
      console.log(this.form)
      if (this.use() === 'create' && this.form instanceof CreateForm) {
        this.form.setValidators(mode);
      } else if (this.use() === 'edit' && this.form instanceof EditForm) {
        this.form.setValidators(mode);
      }
    }
  }

  onCancel() {
    this.form.submitted = false;
    if (this.use() === 'create') {
      this.form.group.reset();
      this.form.group.markAsPristine();
      this.router.navigate([
        `${this.eventsService.dictionary.catalogRoute}/${
          this.eventsService.dictionary.plural
        }`,
      ]);
    } else if (this.use() === 'edit') {
      this.form.group.reset();
      this.form.group.markAsPristine();
      this.router.navigate([
        `${this.eventsService.dictionary.catalogRoute}/${this.item!.id}`,
      ]);
    }
  }

  fillForm() {
    if (this.use() === 'create' && this.form instanceof CreateForm) {
      // this.form.patchWithSample();
    }
  }

  create() {
    if (this.use() === 'create' && this.form instanceof CreateForm) {
      console.log(this.form.getRequest());
      this.eventsService.create(this.form.getRequest(), this.role(), this.view(), this._key).subscribe({
        next: item => {
          this.event.emit(item);
          this.form.submitted = false;
          this.form.group.reset();
          this.form.group.markAsPristine();
        },
        error: (error: BadRequest) => {
          this.form.error = error;
        },
      });
    }
  }

  update() {
    if (this.use() === 'edit' && this.form instanceof EditForm) {
      this.eventsService.update(this.item!.id!, this.form.getRequest()).subscribe({
        next: () => {
          this.form.submitted = false;
          this.snackbarService.success(this.eventsService.dictionary.singularTitlecase + ' actualizado');
          this.form.group.reset();
          this.form.group.markAsPristine();
          this.router.navigate([
            `${this.eventsService.dictionary.catalogRoute}/${this.item!.id}`,
          ]);
        },
        error: (error: any) => {
          this.form.error = error;
        },
      });
    }
  }

}
