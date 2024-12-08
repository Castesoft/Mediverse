import { CommonModule } from "@angular/common";
import { Component, inject, NgModule, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Account } from "../_models/account/account";
import { AccountService } from "src/app/_services/account.service";
import { BreadcrumbService } from "src/app/_services/breadcrumb.service";
import { BootstrapModule } from "src/app/_shared/bootstrap.module";
import { CdkModule } from "src/app/_shared/cdk.module";
import { BreadcrumbLinkComponent, LayoutModule } from "src/app/_shared/layout.module";
import { UtilsService } from '../_services/utils.service';
import { EventsCatalogComponent } from "src/app/events/components/events-catalog.component";
import { HomeEventsCatalogRouteComponent } from "src/app/home/components/home-events-catalog-route.component";

@Component({
  selector: 'home-route',
  template: `
    <div root>
      <div page>
        @if (!utilsService.sidebarCollapsed()){
          <div aside></div>
        }
        <div wrapper>
          <div header></div>
          <div content>
            <div toolbar>
              <div toolbarContainer>
                <div toolbarInfo>
                  <h1 toolbarTitle
                      [title]="'Mi Cuenta'"></h1>
                  <ul breadcrumb>
                    <li breadcrumbLink
                        [label]="'Inicio'"
                        [url]="'/'"></li>
                    <li breadcrumbLink
                        [label]="'Cuenta'"
                        [url]="'/account'"></li>
                    @if (label) {
                      <li breadcrumbLink
                          [label]="label"
                          [active]="true">{{ label }}
                      </li>
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
  standalone: false,
})
export class HomeComponent implements OnInit {
  accountService = inject(AccountService);
  breadcrumbService = inject(BreadcrumbService);
  utilsService = inject(UtilsService);

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
        {
          path: 'search',
          loadChildren: () => import('../search/search.config').then(x => x.SearchModule)
        },
        {
          path: 'patients',
          loadChildren: () => import('../users/users.config').then(x => x.PatientsModule)
        },
        {
          path: 'events',
          component: HomeEventsCatalogRouteComponent,
        },
        {
          path: 'services',
          loadChildren: () => import('../services/services.config').then(x => x.ServicesModule)
        },
        {
          path: 'products',
          loadChildren: () => import('../products/products.config').then(x => x.ProductsModule)
        }, {
          path: 'orders',
          loadChildren: () => import('../orders/orders.config').then(x => x.OrdersModule)
        },
        {
          path: 'prescriptions',
          loadChildren: () => import('../prescriptions/prescriptions.config').then(x => x.PrescriptionsModule)
        },
        {
          path: 'nurses',
          loadChildren: () => import('../users/users.config').then(x => x.NursesModule)
        },
        {
          path: 'clinics',
          loadChildren: () => import('../addresses/addresses.config').then(x => x.AddressesModule)
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class HomeRoutingModule {}

@NgModule({
  declarations: [HomeComponent, HomeEventsCatalogRouteComponent],
  imports: [HomeRoutingModule, BootstrapModule, CdkModule, RouterModule, CommonModule,
    LayoutModule, BreadcrumbLinkComponent, EventsCatalogComponent,],
  exports: [
    HomeComponent
  ]
})
export class HomeModule {}
