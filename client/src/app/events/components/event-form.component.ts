import {CdkAccordion, CdkAccordionItem} from "@angular/cdk/accordion";
import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  input,
  output,
  model,
  effect,
  computed,
  signal,
  viewChild
} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {DateClickArg} from "@fullcalendar/interaction";
import { ToastrService } from "ngx-toastr";
import { Subject, takeUntil } from "rxjs";
import { Event, CreateForm, EditForm, DetailForm } from "src/app/_models/event";
import { FormUse, Role, View } from "src/app/_models/types";
import {User} from "src/app/_models/user";
import { FormsService } from "src/app/_services/forms.service";
import {GuidService} from "src/app/_services/guid.service";
import { IconsService } from "src/app/_services/icons.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AlertModule } from "ngx-bootstrap/alert";
import {DatePipe, JsonPipe} from "@angular/common";
import { ControlsModule } from "src/app/_forms/controls.module";
import { EventsService } from "src/app/_services/events.service";
import {UsersService} from "src/app/_services/users.service";
import {MaterialModule} from "src/app/_shared/material.module";
import {calcDateDiff} from "src/app/_utils/util";
import {UserCardCompactComponent} from "src/app/users/components/user-card-compact.component";
import {UserFormComponent} from "src/app/users/components/user-form.component";

@Component({
  host: { class: 'pb-3', },
  selector: 'div[eventForm]',
  template: `
    @if ((use() === "create" && form) ||
    (use() === "edit" && item && form) ||
    (use() === "detail" && item)) {
      <div errorsAlert [errors]="form.errors"></div>

      <form [formGroup]="form.group" [id]="form.id" (ngSubmit)="onSubmit()">

        <mat-stepper orientation="vertical" [linear]="true" #stepper style="background: transparent!important;">
          <mat-step [stepControl]="form.group.get('patient')!">
            <ng-template matStepLabel>Paciente
              @if (patient) {
                <span class="fw-semibold text-gray-500">({{ patient.fullName }})</span>
              }
            </ng-template>
            @if (usersService.hasSelected(selectPatientKey)) {
              <div userCardCompact [role]="'Patient'" [key]="selectPatientKey" [view]="view()"></div>
            }

            <div class="my-4">
              <button class="btn btn-light-primary me-2"
                      (click)="usersService.showCatalogModal($event, selectPatientKey, 'select', 'Patient')">
                @if (!usersService.hasSelected(selectPatientKey)) {
                  Seleccionar paciente
                } @else {
                  Cambiar paciente
                }
              </button>
              @if (!panelOpenState()) {
                <button
                  matTooltip="Quite al paciente actual para poder agregar uno nuevo."
                  [matTooltipDisabled]="!patient"
                  class="btn btn-light-success me-2" (click)="handlePanelClick($event)">
                  Agregar
                </button>
              }
              @if (usersService.hasSelected(selectPatientKey)) {
                <button class="btn btn-light-danger me-2" (click)="usersService.setSelected$(selectPatientKey)">Quitar
                </button>
              }
            </div>

            <mat-accordion
              matTooltip="Quite al paciente actual para poder agregar uno nuevo."
              [matTooltipDisabled]="!patient"
            >
              <mat-expansion-panel (opened)="panelOpenState.set(true)" (closed)="panelOpenState.set(false)" [expanded]="panelOpenState()"
                                   cdkAccordionItem #patientAccordion
                                   [disabled]="patient"
                                   style="background: transparent!important; box-shadow: none!important;"
              >
                <mat-expansion-panel-header>
                  <mat-panel-title> Crear nuevo paciente</mat-panel-title>
                </mat-expansion-panel-header>

                <div userForm [view]="'page'" [role]="'Patient'" [id]="null" [use]="'create'"></div>

              </mat-expansion-panel>
            </mat-accordion>


            <!--            <div>-->
            <!--              <button mat-button matStepperNext>Next</button>-->
            <!--            </div>-->
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
                      <!--                  El martes 8 de mayo de 8:30-10:30 AM, 2024 -->
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
            <ng-template matStepLabel>Servicio/Tratamiento</ng-template>
            <div inputControl formControlName="firstName" class="fw-semi-bold mb-0 w-100"
                 [submitted]="form.group.controls['firstName'].touched || form.submitted"
                 [placeholder]="'Ingrese el nombre'"
                 [autofocus]="use() !== 'detail'" [label]="'Nombre'" [errors]="{
                                        'required': 'El nombre es requerido.',
                                    }">
            </div>


            <div inputControl formControlName="lastName" class="fw-semi-bold mb-0 w-100" [type]="'text'"
                 [submitted]="form.group.controls['lastName'].touched || form.submitted"
                 [placeholder]="'Ingrese el apellido'"
                 [label]="'apellido'" [errors]="{
                                              'required': 'El apellido es requerido.',
                                          }">
            </div>


            <div inputControl formControlName="email" class="fw-semi-bold mb-0 w-100"
                 [submitted]="form.group.controls['email'].touched || form.submitted" [type]="'email'"
                 [placeholder]="'Ingrese el correo'" [label]="'Correo'" [errors]="{
                                                  'required': 'El correo es requerido.',
                                              }">
            </div>


            <div inputControl formControlName="sex" class="fw-semi-bold mb-0 w-100"
                 [submitted]="form.group.controls['sex'].touched || form.submitted"
                 [placeholder]="'Ingrese el sexo'" [label]="'Sexo'" [errors]="{
                                              'required': 'El sexo es requerido.',
                                          }"></div>
            <!--          <div>-->
            <!--            <button mat-button matStepperPrevious>Back</button>-->
            <!--            <button mat-button (click)="stepper.reset()">Reset</button>-->
            <!--          </div>-->
          </mat-step>
        </mat-stepper>
      </form>
      @if (view() === 'page') {
        <button class="btn btn-primary" [attr.form]="form.id" type="submit">
          @if (use() === "create") {
            Crear {{ service.naming!.singular }}
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
    DatePipe, UserFormComponent, CdkAccordion, CdkAccordionItem,
  ],
})
export class EventFormComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private formsService = inject(FormsService);
  private router = inject(Router);
  matSnackBar = inject(MatSnackBar);
  service = inject(EventsService);
  icons = inject(IconsService);
  usersService = inject(UsersService);
  guid = inject(GuidService);

  id = input.required<number | null>();
  use = input.required<FormUse>();
  view = input.required<View>();
  dateFrom = input<Date>();
  dateTo = input<Date>();

  formId = output<string>();

  item: Event | null = null;
  selectPatientKey: string;
  readonly panelOpenState = signal(false);
  patientAccordion = viewChild<CdkAccordionItem>('patientAccordion');

  form!: CreateForm | EditForm | DetailForm;
  returnUrl: string | null = null;
  private ngUnsubscribe = new Subject<void>();

  isDetail = false;
  patient?: User;

  constructor() {
    this.selectPatientKey = this.guid.gen();

    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (params) => {
        if (params['returnUrl']) this.returnUrl = params['returnUrl'];
      },
    });
  }

  handlePanelClick(event: any) {
    if (this.patient) {
      event.stopPropagation();
    } else {
      this.patientAccordion()?.open();
    }
  }

  ngOnInit(): void {
    console.log(this.dateFrom(), this.dateTo());

    this.usersService.selected$(this.selectPatientKey).subscribe({
      next: user => {
        this.patient = user;
        console.log(this.patientAccordion())
        user && this.patientAccordion()?.close();
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
      this.service.current$.subscribe({
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
      this.router.navigate([`${this.service.naming!.catalogRoute}/${this.service.naming!.plural}`]);
    } else if (this.use() === 'edit') {
      this.form.group.reset();
      this.form.group.markAsPristine();
      this.router.navigate([`${this.service.naming!.catalogRoute}/${this.item!.id}`]);
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
      this.service.create(formValues).subscribe({
        next: (item) => {
          this.form.submitted = false;
          this.matSnackBar.open(this.service.naming!.singularTitlecase + ' agregado', 'Cerrar', { duration: 3000, });
          this.form.group.reset();
          this.form.group.markAsPristine();
          if (this.view() === 'modal') {
            this.service.hideNewModal();
          } else {
            if (this.returnUrl === null) {
              this.router.navigate([`${this.service.naming!.catalogRoute}/${item.id}`]);
            } else {
              this.router.navigate([this.returnUrl]);
            }
          }
        },
        error: (error: any) => {
          this.form.errors = error.errors;
          this.matSnackBar.open(`${this.form.errors.length} errores al agregar ${this.service.naming!.singular}`, 'Cerrar', { duration: 3000, });
        },
      });
    }
  }

  update() {
    const formValues = this.form.group.value;
    if (this.form.group.valid || !this.form.validation) {
      this.service.update(this.item!.id, formValues).subscribe({
        next: () => {
          this.form.submitted = false;
          this.matSnackBar.open(this.service.naming!.singularTitlecase + ' actualizado', 'Cerrar', { duration: 3000, });
          this.form.group.reset();
          this.form.group.markAsPristine();
          this.router.navigate([`${this.service.naming!.catalogRoute}/${this.item!.id}`]);
          this.service.hideEditModal();
        },
        error: (error: any) => {
          this.form.errors = error.errors;
          this.matSnackBar.open(`${this.form.errors.length} errores al actualizar ${this.service.naming!.singular}`, 'Cerrar', { duration: 3000, });
        },
      });
    }
  }
}
