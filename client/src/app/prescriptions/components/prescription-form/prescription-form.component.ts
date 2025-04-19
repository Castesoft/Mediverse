import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  EventEmitter,
  HostBinding,
  inject,
  input,
  InputSignal,
  model,
  ModelSignal,
  OnInit,
  Output,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { firstValueFrom } from 'rxjs';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import { Account } from 'src/app/_models/account/account';
import BaseForm from 'src/app/_models/base/components/extensions/baseForm';
import { View } from 'src/app/_models/base/types';
import { Doctor } from 'src/app/_models/doctors/doctor.model';
import { FormInputSignals } from 'src/app/_models/forms/formComponentInterfaces';
import { FormUse } from 'src/app/_models/forms/formTypes';
import { Prescription } from 'src/app/_models/prescriptions/prescription';
import { PrescriptionFiltersForm } from 'src/app/_models/prescriptions/prescriptionFiltersForm';
import { PrescriptionForm } from 'src/app/_models/prescriptions/prescriptionForm';
import { PrescriptionParams } from 'src/app/_models/prescriptions/prescriptionParams';
import { AccountService } from 'src/app/_services/account.service';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { TableHeaderComponent } from 'src/app/_shared/template/components/tables/table-header.component';
import { ClinicsService } from 'src/app/clinics/clinics.config';
import { PatientsService } from 'src/app/patients/patients.config';
import { ProductsService } from 'src/app/products/products.config';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';
import { Patient } from "src/app/_models/patients/patient";
import { SymbolCellComponent } from "src/app/_shared/template/components/tables/cells/symbol-cell.component";
import { PhotoSize } from "src/app/_models/photos/photoTypes";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { PrescriptionsService } from "src/app/prescriptions/prescriptions.service";
import { MedicalLicense } from "src/app/_models/medicalLicenses/medicalLicense";
import { SubmitOptions } from "src/app/_utils/serviceHelper/types/submitOptions";

@Component({
  selector: '[prescriptionForm]',
  templateUrl: './prescription-form.component.html',
  styleUrl: './prescription-form.component.scss',
  imports: [
    FaIconComponent,
    BootstrapModule,
    CommonModule,
    Forms2Module,
    TableHeaderComponent,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    ProfilePictureComponent,
    SymbolCellComponent,
  ],
})
export class PrescriptionFormComponent extends BaseForm<Prescription, PrescriptionParams, PrescriptionFiltersForm, PrescriptionForm, PrescriptionsService> implements OnInit, FormInputSignals<Prescription> {
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly FormUse: typeof FormUse = FormUse;

  readonly accountService: AccountService = inject(AccountService);

  private readonly productsService: ProductsService = inject(ProductsService);
  private readonly patientsService: PatientsService = inject(PatientsService);
  private readonly clinicsService: ClinicsService = inject(ClinicsService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  @ViewChild('memberTabs', { static: false }) memberTabs?: TabsetComponent;

  @HostBinding('class') get hostClass(): '' | 'pt-9 pb-9' {
    if (this.view() === 'page') return 'pt-9 pb-9';
    else return '';
  }

  use: ModelSignal<FormUse> = model.required<FormUse>();
  view: ModelSignal<View> = model.required<View>();
  item: ModelSignal<Prescription | null> = model.required<Prescription | null>();
  key: ModelSignal<string | null> = model.required();

  fromWrapper: WritableSignal<boolean> = signal<boolean>(false);
  fromEventWindow: InputSignal<boolean> = input<boolean>(false);
  referenceId: InputSignal<string | undefined> = input();
  shouldRedirectAfterSubmit: InputSignal<boolean> = input<boolean>(true);

  @Output() prescriptionCreated = new EventEmitter<Prescription>();

  showAddButton: InputSignal<boolean> = input<boolean>(true);
  showActions: InputSignal<boolean> = input<boolean>(true);

  constructor() {
    super(PrescriptionsService, PrescriptionForm);

    this.productsService.getOptions().subscribe();
    this.patientsService.getOptions().subscribe();
    this.clinicsService.getOptions().subscribe();

    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active())
        .setProductOptions(this.productsService.options())
        .setPatientOptions(this.patientsService.options())
        .setClinicOptions(this.clinicsService.options());

      if (this.use() !== FormUse.CREATE) {
        const item: Prescription | null = this.item();
        if (item !== null) {
          this.form.patchValue(item, { emitEvent: false });
        }
      }

      if (this.fromEventWindow()) {
        if (this.use() === FormUse.CREATE) {
          const item: Prescription | null = this.item();
          if (item !== null) {
            this.form.patchValue(item, { emitEvent: false });
          }
        }
      }
    });
  }

  ngOnInit(): void {
    if (this.item()) {
      this.form.patch(this.item()!, this.fromEventWindow());
    }

    this.setAccountProperties();
    this.subscribeToFormValueChanges();
  }

  private setAccountProperties(): void {
    const account: Account | null = this.accountService.current();
    if (account) {
      this.form.controls.doctor.patchValue(new Doctor({ ...account } as any));
      this.accountService.getMedicalLicenses().subscribe((licenses: MedicalLicense[]) => {
        this.form.patchMedicalLicenses(licenses)
      });
    }
  }

  private subscribeToFormValueChanges(): void {
    this.form.controls.patient.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (patient): Promise<void> => {
      if (patient && patient.id && this.form.controls?.patient?.value?.id !== patient.id) {
        const patientFull: Patient = await firstValueFrom(this.patientsService.getById(patient.id));
        this.form.controls.patient.patchValue(patientFull as any, { emitEvent: false });
      }
    });
  }

  async downloadPrescription() {
    if (!this.item()) return;

    const element: HTMLElement | null = document.getElementById(`prescription-form-${this.item()!.id}`);
    if (!element) return;

    await this.service.export(this.item()!, element, 'download');
  }

  async printPrescription() {
    if (!this.item()) return;

    const element: HTMLElement | null = document.getElementById(`prescription-form-${this.item()!.id}`);
    if (!element) return;

    await this.service.export(this.item()!, element, 'print');
  }

  handleSubmit(): void {
    let submitOptions: SubmitOptions = {
      value: this.form.payload,
      useIdAfterResponseForRedirect: true,
      toastMessage: '¡Receta creada exitosamente!',
    };

    if (this.shouldRedirectAfterSubmit()) {
      submitOptions = {
        ...submitOptions,
        redirectUrl: this.router.url.split('/').slice(0, -1).join('/'),
      };
    }

    this.onSubmit(this.view, this.use, submitOptions)
  }
}
