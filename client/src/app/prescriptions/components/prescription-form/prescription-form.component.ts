import { CommonModule } from "@angular/common";
import { Component, effect, HostBinding, inject, model, ModelSignal, signal, ViewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { TabsetComponent, TabDirective } from "ngx-bootstrap/tabs";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { Subject, takeUntil } from "rxjs";
import { FormNewModule } from "src/app/_forms/_new/forms-new.module";
import { Account } from "src/app/_models/account";
import { SelectOption } from "src/app/_models/base/selectOption";
import { View } from "src/app/_models/base/types";
import { BadRequest } from "src/app/_models/forms/error";
import { BaseForm } from "src/app/_models/forms/extensions/baseFormComponent";
import { FormInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { Prescription } from "src/app/_models/prescriptions/prescription";
import { PrescriptionFiltersForm } from "src/app/_models/prescriptions/prescriptionFiltersForm";
import { PrescriptionForm } from "src/app/_models/prescriptions/prescriptionForm";
import { PrescriptionParams } from "src/app/_models/prescriptions/prescriptionParams";
import { AccountService } from "src/app/_services/account.service";
import { ConfirmService } from "src/app/_services/confirm.service";
import { IconsService } from "src/app/_services/icons.service";
import { BootstrapModule } from "src/app/_shared/bootstrap.module";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";
import { ClinicsService } from "src/app/clinics/clinics.config";
import { EventSelectDisplayCardComponent } from "src/app/events/event-select-display-card.component";
import { EventSelectTypeaheadComponent } from "src/app/events/event-select-typeahead.component";
import { PatientsService } from "src/app/patients/patients.config";
import { PrescriptionsService } from "src/app/prescriptions/prescriptions.config";
import { ProductsService } from "src/app/products/products.config";
import { UserProfilePictureComponent } from "src/app/users/components/user-profile-picture/user-profile-picture.component";
import { UsersService } from "src/app/users/users.config";

@Component({
  selector: '[prescriptionForm]',
  standalone: true,
  imports: [
    FaIconComponent, BootstrapModule,
    EventSelectDisplayCardComponent, EventSelectTypeaheadComponent, CommonModule,
    UserProfilePictureComponent, FormNewModule, TableHeaderComponent,
    TooltipModule, FormsModule, ReactiveFormsModule,
  ],
  templateUrl: './prescription-form.component.html',
  styleUrl: './prescription-form.component.scss'
})
export class PrescriptionFormComponent
  extends BaseForm<Prescription, PrescriptionParams, PrescriptionFiltersForm, PrescriptionForm, PrescriptionsService>
  implements FormInputSignals<Prescription>
{
  accountService = inject(AccountService);
  icons = inject(IconsService);

  private productsService = inject(ProductsService);
  private usersService = inject(UsersService);
  private confirmService = inject(ConfirmService);
  private patientsService = inject(PatientsService);
  private clinicsService = inject(ClinicsService);

  private ngUnsubscribe = new Subject<void>();

  @ViewChild("memberTabs", { static: false }) memberTabs?: TabsetComponent;
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

  constructor() {
    super(PrescriptionsService, PrescriptionForm);

    this.productsService.getOptions().subscribe();
    this.patientsService.getOptions().subscribe();
    this.clinicsService.getOptions().subscribe();

    effect(() => {
      this.account.set(this.accountService.current());
      const value = this.item();

      this.form.use = this.use();
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
        if (params["tab"]) {
          this.selectTab(params["tab"]);
        } else {
          this.selectTab("patient");
        }
      }
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
      queryParamsHandling: "merge"
    });
  };
}
