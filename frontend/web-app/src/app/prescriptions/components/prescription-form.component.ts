import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Subject, takeUntil } from "rxjs";
import { Prescription, CreateForm, EditForm, DetailForm } from "../../_models/prescription";
import { FormUse } from "../../_models/types";
import { ConfirmService } from "../../_services/confirm/confirm.service";
import { PrescriptionsService } from "../../_services/data/prescriptions.service";
import { ReactiveFormsModule } from "@angular/forms";
import { InputControlComponent } from "../../_forms/form-control.component";
import { AlertModule } from "ngx-bootstrap/alert";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsService } from "../../core/services/forms-service.service";
import { IconsService } from "../../_services/icons.service";

@Component({
  host: { class: 'pb-3', },
  selector: '[prescriptionForm]',
  templateUrl: './prescription-form.component.html',
  standalone: true,
  imports: [ FontAwesomeModule, ReactiveFormsModule, InputControlComponent, AlertModule, RouterModule,  ],
})
export class PrescriptionFormComponent implements OnInit, OnDestroy {
  @Input({ required: true }) use!: FormUse;
  @Input() breadcrumbs: string[] = [];

  item: Prescription | null = null;
  id!: number;

  form!: CreateForm | EditForm | DetailForm;
  returnUrl: string | null = null;
  private ngUnsubscribe = new Subject<void>();

  submitAttempted = false;

  validationMode = false;
  validationErrors: string[] = [];

  isDetail = false;

  constructor(
    public service: PrescriptionsService,
    private route: ActivatedRoute,
    private formsService: FormsService,
    private router: Router,
    private confirm: ConfirmService,
    private toastr: ToastrService,
    public icons: IconsService,
  ) {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (params) => {
        if (params['returnUrl']) this.returnUrl = params['returnUrl'];
      },
    });

    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.formsService.mode$.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (mode) => {
        this.validationMode = mode;
        this.applyValidationsToForm(mode);
      },
    });

    if (this.use === 'create') {
      this.form = new CreateForm(this.validationMode);
    } else if (this.use === 'edit') {
      this.form = new EditForm(this.validationMode);
    } else if (this.use === 'detail') {
      this.form = new DetailForm();
    }

    if (this.use === 'edit' || this.use === 'detail') {
      this.service
        .getById(this.id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (item) => {
            this.item = item;
            item && this.form.formGroup.patchValue(item);
          },
        });
    }

    if (this.use === 'detail') {
      this.isDetail = true;
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    this.submitAttempted = true;
    if (this.use === 'create') {
      this.create();
    } else {
      this.update();
    }
  }

  private applyValidationsToForm(mode: boolean) {
    if (this.use === 'create' && this.form instanceof CreateForm) {
      this.form.setValidators(mode);
    } else if (this.use === 'edit' && this.form instanceof EditForm) {
      this.form.setValidators(mode);
    }
  }

  onCancel() {
    this.submitAttempted = false;
    if (this.use === 'create') {
      this.form.formGroup.reset();
      this.form.formGroup.markAsPristine();
      this.router.navigate([`/admin/utilerias/${this.service.subjectRoute}`]);
    } else if (this.use === 'edit') {
      this.form.formGroup.reset();
      this.form.formGroup.markAsPristine();
      this.router.navigate([
        `/admin/utilerias/${this.service.subjectRoute}/` + this.item?.id,
      ]);
    }
  }

  fillForm() {
    if (this.use === 'create' && this.form instanceof CreateForm) {
      this.form.patchWithSample();
    }
  }

  create() {
    const formValues = this.form.formGroup.value;
    if (this.form.formGroup.valid || !this.validationMode) {
      this.service.create(formValues).subscribe({
        next: (item) => {
          this.submitAttempted = false;
          this.toastr.success(
            this.service.subjectSingularUpperCase + ' agregado',
            'Éxito',
          );
          this.form.formGroup.reset();
          this.form.formGroup.markAsPristine();
          if (this.returnUrl === null) {
            this.router.navigate([
              `/admin/utilerias/${this.service.subjectRoute}/` + item.id,
            ]);
          } else {
            this.router.navigate([this.returnUrl]);
          }
        },
        error: (error: any) => {
          this.validationErrors = error.errors;
          this.toastr.error(
            `${this.validationErrors.length} errores al agregar ${this.service.subjectSingular}`,
            'Validación del servidor',
          );
        },
      });
    }
  }

  update() {
    const formValues = this.form.formGroup.value;
    if (this.form.formGroup.valid || !this.validationMode) {
      this.service.update(this.item!.id, formValues).subscribe({
        next: () => {
          this.submitAttempted = false;
          this.toastr.success(
            this.service.subjectSingularUpperCase + ' actualizada',
            'Éxito',
          );
          this.form.formGroup.reset();
          this.form.formGroup.markAsPristine();
          this.router.navigate([
            `/admin/utilerias/${this.service.subjectRoute}/` + this.item?.id,
          ]);
        },
        error: (error: any) => {
          this.validationErrors = error.errors;
          this.toastr.error(
            `${this.validationErrors.length} errores al actualizar ${this.service.subjectSingular}`,
            'Validación del servidor',
          );
        },
      });
    }
  }

  onDelete() {
    Prescription.deleteById(
      this.item!.id,
      this.service,
      this.confirm,
      this.toastr,
    ).subscribe({
      next: (deleted) => {
        if (deleted) {
          const redirectUrl = `/admin/utilerias/${this.service.subjectRoute}`;
          this.router.navigate([redirectUrl]);
        }
      },
    });
  }
}
