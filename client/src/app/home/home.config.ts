import { CommonModule } from "@angular/common";
import { Component, inject, NgModule, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Account } from "src/app/_models/account";
import { AccountService } from "src/app/_services/account.service";
import { BreadcrumbService } from "src/app/_services/breadcrumb.service";
import { BootstrapModule } from "src/app/_shared/bootstrap.module";
import { CdkModule } from "src/app/_shared/cdk.module";
import { BreadcrumbLinkComponent, LayoutModule } from "src/app/_shared/layout.module";

@Component({
  selector: 'home-route',
  template: `
    <div root>
      <div page>
        <div aside></div>
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
                    @if (label) {
                      <li breadcrumbLink [label]="label" [active]="true">{{ label }}</li>
                    }
                  </ul>
                </div>
                <div toolbarActions></div>
              </div>
            </div>
            <div post>
              <router-outlet></router-outlet>
            </div>
          </div>
          <div footer></div>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  accountService = inject(AccountService);
  breadcrumbService = inject(BreadcrumbService);

  account: Account | null = null;
  label?: string;

  ngOnInit(): void {
    this.account = this.accountService.current();
    this.breadcrumbService.breadcrumb$.subscribe({
      next: breadcrumb => {
        this.label = breadcrumb;
      }
    });
  }
}

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: HomeComponent,
      children: [
        { path: 'patients',
          loadChildren: () => import('../users/users.config').then(x => x.PatientsModule)
        },
        { path: 'events',
          loadChildren: () => import('../events/events.config').then(x => x.EventsModule)
        },
        { path: 'services',
          loadChildren: () => import('../services/services.config').then(x => x.ServicesModule)
        },
        { path: 'products',
          loadChildren: () => import('../products/products.config').then(x => x.ProductsModule)
        },
        {
          path: 'prescriptions',
          loadChildren: () => import('../prescriptions/prescriptions.config').then(x => x.PrescriptionsModule)
        },
        { path: 'nurses',
          loadChildren: () => import('../users/users.config').then(x => x.NursesModule)
        },
        { path: 'clinics',
          loadChildren: () => import('../addresses/addresses.config').then(x => x.ClinicsModule)
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

@NgModule({
  declarations: [HomeComponent],
  imports: [HomeRoutingModule, BootstrapModule, CdkModule, RouterModule, CommonModule,
    LayoutModule, BreadcrumbLinkComponent,],
  exports: [
    HomeComponent
  ]
})
export class HomeModule {}
