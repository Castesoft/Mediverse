import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  ViewChild,
  HostBinding,
  model,
  ModelSignal,
  signal,
  effect,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import { Account } from 'src/app/_models/account/account';
import BaseForm from 'src/app/_models/base/components/extensions/baseForm';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { View } from 'src/app/_models/base/types';
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
    // EventSelectDisplayCardComponent,
    // EventSelectTypeaheadComponent,
    ProfilePictureComponent,
  ],
  templateUrl: './prescription-form.component.html',
  styleUrl: './prescription-form.component.scss',
})
export class PrescriptionFormComponent
  extends BaseForm<
    Prescription,
    PrescriptionParams,
    PrescriptionFiltersForm,
    PrescriptionForm,
    PrescriptionsService
  >
  implements FormInputSignals<Prescription>
{
  accountService = inject(AccountService);

  private productsService = inject(ProductsService);
  private patientsService = inject(PatientsService);
  private clinicsService = inject(ClinicsService);

  private ngUnsubscribe = new Subject<void>();

  @ViewChild('memberTabs', { static: false }) memberTabs?: TabsetComponent;
  @HostBinding('class') get hostClass() {
    if (this.view() === 'page') return 'pt-9 pb-9';
    else return '';
  }

  use = model.required<FormUse>();
  view = model.required<View>();
  item = model.required<Prescription | null>();
  key: ModelSignal<string | null> = model.required();

  activeTab?: TabDirective;
  account = signal<Account | null>(null);

  productOptions = signal<SelectOption[]>([]);
  patientOptions = signal<SelectOption[]>([]);
  clinicOptions = signal<SelectOption[]>([]);

  fromWrapper = signal<boolean>(false);

  constructor() {
    super(PrescriptionsService, PrescriptionForm);

    this.productsService.getOptions().subscribe();
    this.patientsService.getOptions().subscribe();
    this.clinicsService.getOptions().subscribe();

    effect(() => {
      this.account.set(this.accountService.current());
      const value = this.item();

      this.form
        .setUse(this.use())
        .setValidation(this.validation.active())
      ;

      this.form.productOptions = this.productsService.options();
      this.form.patientOptions = this.patientsService.options();
      this.form.clinicOptions = this.clinicsService.options();

      const account = this.accountService.current();
      if (account !== null) {
        this.form.patch(account, this.item()!);
      }
      this.form.setUse(this.use());
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private subscribeToRouteQueryParams = () => {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (params) => {
        if (params['tab']) {
          this.selectTab(params['tab']);
        } else {
          this.selectTab('patient');
        }
      },
    });
  };

  private selectTab = (id: string) => {
    if (this.memberTabs) {
      console.log(id);
      const tab = this.memberTabs.tabs.find((x) => x.id === id);
      if (tab) {
        tab.active = true;
      }
    }
  };

  onTabActivated = (data: TabDirective) => {
    this.activeTab = data;
    console.log(this.activeTab.id);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: data.id },
      queryParamsHandling: 'merge',
    });
  };
}
