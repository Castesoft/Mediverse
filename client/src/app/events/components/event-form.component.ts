import { CdkAccordion, CdkAccordionItem } from "@angular/cdk/accordion";
import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  input,
  output, signal,
  viewChild
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { Event, CreateForm, EditForm, DetailForm } from "src/app/_models/event";
import {BadRequest, FormUse, View} from "src/app/_models/types";
import { User } from "src/app/_models/user";
import { FormsService } from "src/app/_services/forms.service";
import { GuidService } from "src/app/_services/guid.service";
import { IconsService } from "src/app/_services/icons.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AlertModule } from "ngx-bootstrap/alert";
import { CurrencyPipe, DatePipe, JsonPipe } from "@angular/common";
import { ControlsModule } from "src/app/_forms/controls.module";
import { EventsService } from "src/app/_services/events.service";
import { UsersService } from "src/app/_services/users.service";
import { MaterialModule } from "src/app/_shared/material.module";
import { calcDateDiff } from "src/app/_utils/util";
import { UserCardCompactComponent } from "src/app/users/components/user-card-compact.component";
import { UserFormComponent } from "src/app/users/components/user-form.component";
import { ServicesService } from "src/app/_services/services.service";
import { Service } from "src/app/_models/service";
import { ServiceCardCompactComponent } from "src/app/services/components/service-card-compact.component";
import { ServiceFormComponent } from "src/app/services/components/service-form.component";
import {UsersCatalogComponent, UsersListSelectComponent} from "src/app/users/components/users-catalog.component";

@Component({
  host: { class: 'pb-3', },
  selector: 'div[eventForm]',
  template: `
    @if ((use() === "create" && form) ||
    (use() === "edit" && item && form) ||
    (use() === "detail" && item)) {
      @if(form.error){<div errorsAlert [error]="form.error"></div>}

      <form [formGroup]="form.group" [id]="form.id" (ngSubmit)="onSubmit()">

        <mat-stepper orientation="vertical" [linear]="true" #stepper style="background: transparent!important;">
          <mat-step [stepControl]="form.group.get('patient')!">
            <ng-template matStepLabel>Paciente
              @if (patient) {
                <span class="fw-semibold text-gray-500">({{ patient.fullName }})</span>
              }
            </ng-template>
            @if (patient) {
              <div userCardCompact [role]="'Patient'" [key]="selectPatientKey" [view]="view()"></div>
            }

            <div class="my-4">
              <button class="btn btn-light-primary me-2" type="button"
                      (click)="usersService.showCatalogModal($event, selectPatientKey, 'select', 'Patient')">
                @if (!patient) {
                  Seleccionar paciente
                } @else {
                  Cambiar paciente
                }
              </button>
              @if (!patientPanelOpen()) {
                <button
                  matTooltip="Quite al paciente actual para poder agregar uno nuevo."
                  [matTooltipDisabled]="!patient" type="button"
                  class="btn btn-light-success me-2" (click)="handlePatientPanelClick($event)">
                  Agregar
                </button>
              }
              @if (patient) {
                <button class="btn btn-light-danger me-2" type="button" (click)="usersService.setSelected$(selectPatientKey)">Quitar
                </button>
              }
            </div>

            <mat-accordion
              matTooltip="Quite al paciente actual para poder agregar uno nuevo."
              [matTooltipDisabled]="!patient"
            >
              <mat-expansion-panel (opened)="patientPanelOpen.set(true)" (closed)="patientPanelOpen.set(false)" [expanded]="patientPanelOpen()"
                                   cdkAccordionItem #patientAccordion
                                   [disabled]="patient"
                                   style="background: transparent!important; box-shadow: none!important;"
              >
                <mat-expansion-panel-header>
                  <mat-panel-title> Crear nuevo paciente</mat-panel-title>
                </mat-expansion-panel-header>
                <div userForm [view]="'inline'" [role]="'Patient'" [id]="null" [use]="'create'" [key]="selectPatientKey" (user)="usersService.setSelected$(selectPatientKey, $event)"></div>
              </mat-expansion-panel>
            </mat-accordion>
          </mat-step>
          <mat-step [stepControl]="form.group.get('dateTime')!">
            <ng-template matStepLabel>Fecha y hora
              <span class="fw-semibold text-gray-500">
                @if (form.group.get('dateTime')!.get('dateFrom')?.value && form.group.get('dateTime')!.get('dateTo')?.value) {
                  @if (form.group.get('dateTime')!.get('allDay')!.value) {
                    @if (form.group.get('dateTime')!.get('dateFrom')!.value === form.group.get('dateTime')!.get('dateTo')!.value) {
                      El {{ form.group.get('dateTime')!.get('dateFrom')!.value | date: "EEEE d 'de' MMMM, YYYY": "": "es-MX" }}
                    } @else {
                      Del @if (form.group.get('dateTime')!.get('dateFrom')!.value) {
                        {{ form.group.get('dateTime')!.get('dateFrom')!.value | date: "EEEE d 'de' MMMM": "": "es-MX" }}
                      }
                      @if (form.group.get('dateTime')!.get('dateTo')!.value) {
                        al {{ form.group.get('dateTime')!.get('dateTo')!.value | date: "EEEE d 'de' MMMM, YYYY": "": "es-MX" }}
                      }
                    }
                  } @else {
                    @if (form.group.get('dateTime')!.get('dateFrom')!.value === form.group.get('dateTime')!.get('dateTo')!.value) {
                        El {{ form.group.get('dateTime')!.get('dateFrom')!.value | date: "EEEE d 'de' MMMM": "": "es-MX" }}
                      {{ form.group.get('dateTime')!.get('timeFrom')!.value | date: "h:mm": "": "es-MX" }}-{{ form.group.get('dateTime')!.get('timeTo')!.value | date: "h:mm a": "": "es-MX" }}
                      {{ form.group.get('dateTime')!.get('dateTo')!.value | date: "YYYY": "": "es-MX" }}
                    } @else {
                      Del @if (form.group.get('dateTime')!.get('dateFrom')!.value) {
                        {{ form.group.get('dateTime')!.get('dateFrom')!.value | date: "EEEE d 'de' MMMM 'a las' h:mm a": "": "es-MX" }}
                      }
                      @if (form.group.get('dateTime')!.get('dateTo')!.value) {
                        al {{ form.group.get('dateTime')!.get('dateTo')!.value | date: "EEEE d 'de' MMMM 'a las' h:mm a, YYYY": "": "es-MX" }}
                      }
                    }
                  }
                }
                </span>
            </ng-template>
            <div formGroupName="dateTime">
              <div formControlName="allDay" controlCheck [label]="'Dia completo'"></div>
              <div class="row row-cols-lg-2 g-10">
                <div class="col">
                  <div controlDate formControlName="dateFrom" [label]="'Fecha de inicio'"></div>
                </div>
                @if (!form.group.get('dateTime')!.get('allDay')!.value) {
                  <div class="col">
                    <div controlDate formControlName="timeFrom" [label]="'Hora de inicio'"
                         [timepicker]="true"></div>
                  </div>
                }
              </div>
              <div class="row row-cols-lg-2 g-10">
                <div class="col">
                  <div controlDate formControlName="dateTo" [label]="'Fecha fin'"></div>
                </div>
                @if (!form.group.get('dateTime')!.get('allDay')!.value) {
                  <div class="col">
                    <div controlDate formControlName="timeTo" [label]="'Hora fin'" [timepicker]="true"></div>
                  </div>
                }
              </div>
            </div>

          </mat-step>
          <mat-step>
            <ng-template matStepLabel>Servicio/Tratamiento
            @if (service) {
                <span class="fw-semibold text-gray-500">({{ service.name }}) {{service.price | currency}}</span>
              }
            </ng-template>
            @if (service) {
              <div serviceCardCompact [key]="selectServiceKey" [view]="view()"></div>
            }

            <div class="my-4">
              <button class="btn btn-light-primary me-2" type="button"
                      (click)="servicesService.showCatalogModal($event, selectServiceKey, 'select')">
                @if (!service) {
                  Seleccionar servicio
                } @else {
                  Cambiar servicio
                }
              </button>
              @if (!servicePanelOpen()) {
                <button
                  matTooltip="Quite al servicio actual para poder agregar uno nuevo."
                  [matTooltipDisabled]="!service" type="button"
                  class="btn btn-light-success me-2" (click)="handleServicePanelClick($event)">
                  Agregar
                </button>
              }
              @if (service) {
                <button class="btn btn-light-danger me-2" type="button" (click)="servicesService.setSelected$(selectServiceKey)">Quitar
                </button>
              }
            </div>

            <mat-accordion
              matTooltip="Quite el servicio actual para poder agregar uno nuevo."
              [matTooltipDisabled]="!service"
            >
              <mat-expansion-panel (opened)="servicePanelOpen.set(true)" (closed)="servicePanelOpen.set(false)" [expanded]="servicePanelOpen()"
                                   cdkAccordionItem #serviceAccordion
                                   [disabled]="service"
                                   style="background: transparent!important; box-shadow: none!important;"
              >
                <mat-expansion-panel-header>
                  <mat-panel-title> Crear nuevo servicio</mat-panel-title>
                </mat-expansion-panel-header>

                <div serviceForm [view]="'inline'" [id]="null" [use]="'create'" [key]="selectServiceKey" (itemToReturn)="servicesService.setSelected$(selectServiceKey, $event)"></div>

              </mat-expansion-panel>
            </mat-accordion>
          </mat-step>
          <mat-step>
            <ng-template matStepLabel>
            <span class="fw-semibold text-gray-500">

              @if(!nurses || nurses.length === 0) {
                Seleccione uno o muchos especialistas
              } @else {
                @if(nurses.length === 1) {
                  Especialista: {{nurses[0].fullName}} ({{nurses[0].post}})
                } @else {
                  ({{nurses.length}}) Especialistas:
                  @for(item of nurses; let idx = $index; track idx; let last = $last) {
                    {{item.firstName}} ({{item.education}}) @if (!last) {,}
                  }
                }
              }
              </span>
            </ng-template>
            <div
              usersListSelect
              [mode]="'multiselect'"
              [key]="selectNursesKey"
              [view]="'page'"
              [role]="'Nurse'"
            ></div>

          </mat-step>
        </mat-stepper>
      </form>
      @if (view() === 'page') {
        <button class="btn btn-primary" [attr.form]="form.id" type="submit">
          @if (use() === "create") {
            Crear {{ eventsService.naming!.singular }}
          } @else if (use() === "edit") {
            Guardar cambios
          }
        </button>
      }
    }
  `,
  standalone: true,
  styles: `

  `,
  imports: [FontAwesomeModule, AlertModule, RouterModule, JsonPipe, ControlsModule, MaterialModule, UserCardCompactComponent,
    DatePipe, UserFormComponent, CdkAccordion, CdkAccordionItem, ServiceCardCompactComponent, ServiceFormComponent,
    CurrencyPipe, UsersCatalogComponent, UsersListSelectComponent,
  ],
})
export class EventFormComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private formsService = inject(FormsService);
  private router = inject(Router);
  matSnackBar = inject(MatSnackBar);
  eventsService = inject(EventsService);
  icons = inject(IconsService);
  usersService = inject(UsersService);
  servicesService = inject(ServicesService);
  guid = inject(GuidService);

  id = input.required<number | null>();
  use = input.required<FormUse>();
  view = input.required<View>();
  dateFrom = input<Date>();
  dateTo = input<Date>();

  formId = output<string>();

  item: Event | null = null;
  selectPatientKey: string;
  selectServiceKey: string;
  selectNursesKey: string;

  readonly patientPanelOpen = signal(false);
  patientAccordion = viewChild<CdkAccordionItem>('patientAccordion');
  readonly servicePanelOpen = signal(false);
  serviceAccordion = viewChild<CdkAccordionItem>('serviceAccordion');
  readonly nursesPanelOpen = signal(false);
  nursesAccordion = viewChild<CdkAccordionItem>('nursesAccordion');

  form!: CreateForm | EditForm | DetailForm;
  returnUrl: string | null = null;
  private ngUnsubscribe = new Subject<void>();

  isDetail = false;
  patient?: User;
  service?: Service;
  nurses?: User[];

  constructor() {
    this.selectPatientKey = this.guid.gen();
    this.selectServiceKey = this.guid.gen();
    this.selectNursesKey = this.guid.gen();

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
    this.usersService.selected$(this.selectPatientKey).subscribe({
      next: user => {
        this.patient = user;
        user && this.patientAccordion()?.close();
      }
    });

    this.servicesService.selected$(this.selectServiceKey).subscribe({
      next: service => {
        this.service = service;
        service && this.serviceAccordion()?.close();
      }
    });

    this.usersService.multipleSelected$(this.selectNursesKey).subscribe({
      next: nurses => {
        this.nurses = nurses;
        nurses && this.nursesAccordion()?.close();
      }
    });

    if (this.use() === 'create') {
      this.form = new CreateForm();
    } else if (this.use() === 'edit') {
      this.form = new EditForm();
    } else if (this.use() === 'detail') {
      this.form = new DetailForm();
    }

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
      this.dateFrom() && this.form.group.get('dateTime')!.get('dateFrom')!.setValue(this.dateFrom());
      this.dateTo() && this.form.group.get('dateTime')!.get('dateTo')!.setValue(this.dateTo());
      if (this.dateFrom() && this.dateTo()) {
        console.log('hi')
        console.log(calcDateDiff(this.dateFrom()!, this.dateTo()!));
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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    console.log('onSubmit',this.form.group.value)
    this.form.submitted = true;
    // if (this.use() === 'create') {
    //   this.create();
    // } else {
    //   this.update();
    // }
  }

  private applyValidationsToForm(mode: boolean) {
    if (this.form) {
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
      this.router.navigate([`${this.eventsService.naming!.catalogRoute}/${this.eventsService.naming!.plural}`]);
    } else if (this.use() === 'edit') {
      this.form.group.reset();
      this.form.group.markAsPristine();
      this.router.navigate([`${this.eventsService.naming!.catalogRoute}/${this.item!.id}`]);
    }
  }

  fillForm() {
    if (this.use() === 'create' && this.form instanceof CreateForm) {
      // this.form.patchWithSample();
    }
  }

  create() {
    const formValues = this.form.group.value;
    if (this.form.group.valid || !this.form.validation) {
      this.eventsService.create(formValues).subscribe({
        next: (item) => {
          this.form.submitted = false;
          this.matSnackBar.open(this.eventsService.naming!.singularTitlecase + ' agregado', 'Cerrar', { duration: 3000, });
          this.form.group.reset();
          this.form.group.markAsPristine();
          if (this.view() === 'modal') {
            this.eventsService.hideNewModal();
          } else {
            if (this.returnUrl === null) {
              this.router.navigate([`${this.eventsService.naming!.catalogRoute}/${item.id}`]);
            } else {
              this.router.navigate([this.returnUrl]);
            }
          }
        },
        error: (error: any) => {
          this.form.error = error;
        },
      });
    }
  }

  update() {
    const formValues = this.form.group.value;
    if (this.form.group.valid || !this.form.validation) {
      this.eventsService.update(this.item!.id, formValues).subscribe({
        next: () => {
          this.form.submitted = false;
          this.matSnackBar.open(this.eventsService.naming!.singularTitlecase + ' actualizado', 'Cerrar', { duration: 3000, });
          this.form.group.reset();
          this.form.group.markAsPristine();
          this.router.navigate([`${this.eventsService.naming!.catalogRoute}/${this.item!.id}`]);
          this.eventsService.hideEditModal();
        },
        error: (error: BadRequest) => {
          this.form.error = error;
        },
      });
    }
  }
}
