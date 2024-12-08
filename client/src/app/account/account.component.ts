import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component, OnInit, inject, NgModule } from "@angular/core";
import { ResolveFn, RouterModule } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import { Account } from "src/app/_models/account/account";
import { SatisfactionSurvey } from "src/app/_models/satisfactionSurvey";
import { AccountService } from "src/app/_services/account.service";
import { BreadcrumbService } from "src/app/_services/breadcrumb.service";
import { UtilsService } from "src/app/_services/utils.service";
import { BootstrapModule } from "src/app/_shared/bootstrap.module";
import { CdkModule } from "src/app/_shared/cdk.module";
import { LayoutModule } from "src/app/_shared/layout.module";
import { MainAsideComponent } from "src/app/_shared/layout/main-aside.component";
import { AccountBillingComponent } from "src/app/account/components/account-billing/account-billing.component";
import { AccountCardComponent } from "src/app/account/components/account-card.component";
import { AccountClinicalHistoryComponent } from "src/app/account/components/account-clinical-history/account-clinical-history.component";
import { AccountInsurancesComponent } from "src/app/account/components/account-insurances/account-insurances.component";
import { AccountOverviewComponent } from "src/app/account/components/account-overview/account-overview.component";
import { AccountPaymentsComponent } from "src/app/account/components/account-payments/account-payments.component";
import { AccountSchedulesComponent } from "src/app/account/components/account-schedules/account-schedules.component";
import { AccountSettingsComponent } from "src/app/account/components/account-settings/account-settings.component";
import { SatisfactionSurveyModalComponent } from "src/app/account/components/satisfaction-survey-modal/satisfaction-survey-modal.component";

@Component({
  selector: 'account-main-route',
  template: `
  <div root>
    <div page>
      @if (!utilsService.sidebarCollapsed()){
        <div mainAside></div>
      }
      <div wrapper>
        <div header></div>
        <div content>
          <div toolbar>
            <div toolbarContainer>
              <div toolbarInfo>
                <h1 toolbarTitle [title]="'Mi Cuenta'"></h1>
                <ul breadcrumb>
                  <li breadcrumbLink [label]="'Inicio'" [url]="'/'"></li>
                  <li breadcrumbLink [label]="'Cuenta'" [url]="'/account'"></li>
                  @if(label){<li breadcrumbLink [label]="label" [active]="true">{{label}}</li>}
                </ul>
              </div>
              <div toolbarActions></div>
            </div>
          </div>
          <div post>
            @if(account && label !== 'Configuración'){<div card><div accountCard [account]="account"></div></div>}
            <router-outlet></router-outlet>
          </div>
        </div>
        <div footer></div>
      </div>
    </div>
  </div>`,
  standalone: false,
})
export class AccountComponent implements OnInit {
  private bsModalService = inject(BsModalService);
  utilsService = inject(UtilsService);
  accountService = inject(AccountService);
  breadcrumbService = inject(BreadcrumbService);

  account: Account | null = null;
  label?: string;
  satisfactionSurveys: SatisfactionSurvey[] = [];

  ngOnInit(): void {
    this.accountService.getSatisfactionSurveys().subscribe({
      next: surveys => {
        this.satisfactionSurveys = surveys;

        if (this.satisfactionSurveys.length > 0 && false) {
        this.bsModalService.show(SatisfactionSurveyModalComponent, {
          initialState: {
            satisfactionSurvey: this.satisfactionSurveys[0],
          },
        });

        this.bsModalService.onHide.subscribe(() => {
          this.satisfactionSurveys.shift();
          if (this.satisfactionSurveys.length > 0) {
            this.bsModalService.show(SatisfactionSurveyModalComponent, {
              initialState: {
                satisfactionSurvey: this.satisfactionSurveys[0],
              },
            });
            }
          });
        }
      }
    });

    this.account = this.accountService.current();
    this.breadcrumbService.breadcrumb$.subscribe({
      next: breadcrumb => {
        this.label = breadcrumb;
      }
    });
  }
}

export const itemResolver: ResolveFn<Account | null> = (route, state) => {
  const service = inject(AccountService);
  return service.current();
};

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: AccountComponent, resolve: { item: itemResolver },
      children: [
        { path: '', component: AccountOverviewComponent, data: { breadcrumb: 'Mi Cuenta', }, title: 'Mi Cuenta',  },
        { path: 'clinical-history', component: AccountClinicalHistoryComponent, data: { breadcrumb: 'Historial Clínico', }, title: 'Historial Clínico',  },
        { path: 'settings', component: AccountSettingsComponent, data: { breadcrumb: 'Configuración', }, title: 'Configuración', },
        { path: 'billing', component: AccountBillingComponent, data: { breadcrumb: 'Facturación', }, title: 'Facturación', },
        { path: 'payments', component: AccountPaymentsComponent, data: { breadcrumb: 'Pagos', }, title: 'Pagos', },
        { path: 'insurances', component: AccountInsurancesComponent, data: { breadcrumb: 'Seguros', }, title: 'Seguros', },
        { path: 'schedules', component: AccountSchedulesComponent, data: { breadcrumb: 'Horarios', }, title: 'Horarios', },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class AccountRoutingModule {}

@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    AccountRoutingModule, BootstrapModule, CdkModule, RouterModule, CommonModule,
    LayoutModule, AccountCardComponent, MainAsideComponent,
  ]
})
export class AccountModule { }
