import { Component, effect, HostBinding, inject, model, OnDestroy, signal, ViewChild } from '@angular/core';
import { Prescription, PrescriptionForm } from 'src/app/_models/prescription';
import { BadRequest, FormUse, View } from 'src/app/_models/types';
import { ProductsService } from 'src/app/_services/products.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconsService } from 'src/app/_services/icons.service';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { EventSelectDisplayCardComponent } from 'src/app/events/event-select-display-card.component';
import { EventSelectTypeaheadComponent } from 'src/app/events/event-select-typeahead.component';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmService } from 'src/app/_services/confirm.service';
import { AccountService } from 'src/app/_services/account.service';
import { PrescriptionsService } from 'src/app/_services/prescriptions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsetComponent } from "ngx-bootstrap/tabs";
import { CommonModule } from '@angular/common';
import { UserProfilePictureComponent } from 'src/app/users/components/user-profile-picture/user-profile-picture.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormNewModule } from 'src/app/_forms/_new/forms-new.module';
import { Account } from 'src/app/_models/account';
import { SelectOption } from 'src/app/_forms/form';
import { UsersService } from 'src/app/_services/users.service';
import { TableHeaderComponent } from 'src/app/_shared/table/table-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientsService } from 'src/app/patients/patients.config';
import { ClinicsService } from 'src/app/clinics/clinics.config';

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
export class PrescriptionFormComponent implements OnDestroy {
  accountService = inject(AccountService);
  icons = inject(IconsService);
  router = inject(Router);
  service = inject(PrescriptionsService);

  private productsService = inject(ProductsService);
  private usersService = inject(UsersService);
  private confirmService = inject(ConfirmService);
  private patientsService = inject(PatientsService);
  private clinicsService = inject(ClinicsService);

  private ngUnsubscribe = new Subject<void>();
  private route = inject(ActivatedRoute);

  @ViewChild("memberTabs", { static: false }) memberTabs?: TabsetComponent;
  @HostBinding('class') get hostClass() {
    if (this.view() === 'page') return 'pt-9 pb-9';
    else return '';
  }

  use = model.required<FormUse>();
  view = model.required<View>();
  item = model.required<Prescription | null>();

  activeTab?: TabDirective;
  form = new PrescriptionForm();
  account = signal<Account | null>(null);

  productOptions = signal<SelectOption[]>([]);
  patientOptions = signal<SelectOption[]>([]);
  clinicOptions = signal<SelectOption[]>([]);

  constructor() {
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
    }, { allowSignalWrites: true });
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

  onSubmit() {
    this.form.submitted = true;
    switch (this.use()) {
      case 'create':
        this.create();
        break;
      case 'edit':
        this.update();
        break;
    }
  }

  onCancel() {
    this.form.submitted = false;
    if (this.use() === 'create') {
      this.form.reset();
    } else if (this.use() === 'edit') {
      this.form.reset();
    }
  }

  create() {
    this.service.create(this.form.payload, this.view()).subscribe({
      next: response => {
        this.form.onSuccess(response);
        this.use.set('detail');
      },
      error: (error: BadRequest) => this.form.error = error
    });
  }

  update() {
    this.service.update(this.item()!.id!, this.form.payload, this.view()).subscribe({
      next: response => {
        this.form.onSuccess(response);
        this.use.set('detail');
      },
      error: (error: BadRequest) => this.form.error = error
    });
  }
}
