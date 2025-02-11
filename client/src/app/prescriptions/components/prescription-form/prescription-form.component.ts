import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  ViewChild,
  HostBinding,
  model,
  ModelSignal,
  signal,
  effect, OnDestroy, OnInit, input, InputSignal, WritableSignal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import { Account } from 'src/app/_models/account/account';
import BaseForm from 'src/app/_models/base/components/extensions/baseForm';
import { View } from 'src/app/_models/base/types';
import { Doctor } from 'src/app/_models/doctors/doctor';
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
import { PrescriptionsService } from 'src/app/prescriptions/prescriptions.config';
import { ProductsService } from 'src/app/products/products.config';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';

@Component({
  selector: '[prescriptionForm]',
  standalone: true,
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
  ],
  templateUrl: './prescription-form.component.html',
  styleUrl: './prescription-form.component.scss',
})
export class PrescriptionFormComponent
  extends BaseForm<Prescription, PrescriptionParams, PrescriptionFiltersForm, PrescriptionForm, PrescriptionsService>
  implements OnInit, OnDestroy, FormInputSignals<Prescription>
{
  readonly accountService = inject(AccountService);

  private productsService = inject(ProductsService);
  private patientsService = inject(PatientsService);
  private clinicsService = inject(ClinicsService);

  private ngUnsubscribe = new Subject<void>();

  @ViewChild('memberTabs', { static: false }) memberTabs?: TabsetComponent;

  @HostBinding('class') get hostClass(): '' | 'pt-9 pb-9' {
    if (this.view() === 'page') return 'pt-9 pb-9';
    else return '';
  }

  use: ModelSignal<FormUse> = model.required<FormUse>();
  view: ModelSignal<View> = model.required<View>();
  item: ModelSignal<Prescription | null> = model.required<Prescription | null>();
  key: ModelSignal<string | null> = model.required();

  activeTab?: TabDirective;

  fromWrapper: WritableSignal<boolean> = signal<boolean>(false);
  fromEventWindow: InputSignal<boolean> = input<boolean>(false);

  constructor() {
    super(PrescriptionsService, PrescriptionForm);

    this.productsService.getOptions().subscribe();
    this.patientsService.getOptions().subscribe();
    this.clinicsService.getOptions().subscribe();

    effect(() => {

      console.log('prescriptionItem', this.item());


      this.form
        .setUse(this.use())
        .setValidation(this.validation.active())
        .setProductOptions(this.productsService.options())
        .setPatientOptions(this.patientsService.options())
        .setClinicOptions(this.clinicsService.options());
      ;

      if (this.use() === 'create') {

      } else {
        const item = this.item();

        if (item !== null) {
          console.log('item', item);

          // this.form.customPatch(item);
          this.form.patchValue(item);
        }
      }

      if (this.fromEventWindow() === true) {
        if (this.use() === 'create') {
          const item = this.item();

          if (item !== null) {
            // this.form.customPatch(item);
            this.form.patchValue(item);
          }
        }
      }

    });

    this.subscribeToFormValueChanges();
  }

  private subscribeToFormValueChanges(): void {
    this.form.controls.patient.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(async (patient): Promise<void> => {
      if (patient && patient.id) {
        const patientFull = await firstValueFrom(this.patientsService.getById(patient.id));
        this.form.controls.patient.patchValue(patientFull as any, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    if (this.item()) {
      this.form.patch(this.item()!, this.fromEventWindow());
    }

    const account: Account | null = this.accountService.current();
    if (account) {
      this.form.controls.doctor.patchValue(new Doctor({...account} as any));
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private subscribeToRouteQueryParams(): void {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (params): void => {
        if (params['tab']) {
          this.selectTab(params['tab']);
        } else {
          this.selectTab('patient');
        }
      },
    });
  };

  private selectTab(id: string): void {
    if (this.memberTabs) {
      const tab: TabDirective | undefined = this.memberTabs.tabs.find((x) => x.id === id);
      if (tab) {
        tab.active = true;
      }
    }
  };

  onTabActivated(data: TabDirective): void {
    this.activeTab = data;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: data.id },
      queryParamsHandling: 'merge',
    }).then(() => {});
  };
}
