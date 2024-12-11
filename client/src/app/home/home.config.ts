import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Account } from 'src/app/_models/account/account';
import { AccountService } from 'src/app/_services/account.service';
import { BreadcrumbService } from 'src/app/_services/breadcrumb.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { BreadcrumbLinkComponent } from 'src/app/_shared/template/components/breadcrumbs/breadcrumb-link.component';
import { MainAsideComponent } from 'src/app/_shared/template/components/main-aside.component';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { AddressesCatalogComponent } from 'src/app/addresses/components/addresses-catalog.component';
import { EventsCatalogComponent } from 'src/app/events/components/events-catalog.component';
import { HomeClinicsCatalogRouteComponent } from 'src/app/home/components/home-clinics-catalog-route.component';
import { HomeEventsCatalogRouteComponent } from 'src/app/home/components/home-events-catalog-route.component';
import { HomePatientsCatalogRouteComponent } from 'src/app/home/components/home-patients-catalog-route.component';
import { HomeProductsCatalogRouteComponent } from 'src/app/home/components/home-products-catalog-route.component';
import { HomeServicesCatalogRouteComponent } from 'src/app/home/components/home-services-catalog-route.component';
import { ProductsCatalogComponent } from 'src/app/products/components/products-catalog.component';
import { ServicesCatalogComponent } from 'src/app/services/components/services-catalog.component';
import { UsersCatalogComponent } from 'src/app/users/components/users-catalog.component';

@Component({
  selector: 'home-route',
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
          path: 'pacientes',
          component: HomePatientsCatalogRouteComponent,
        },
        {
          path: 'citas',
          component: HomeEventsCatalogRouteComponent,
        },
        {
          path: 'servicios',
          component: HomeServicesCatalogRouteComponent,
        },
        {
          path: 'productos',
          component: HomeProductsCatalogRouteComponent,
        }, {
          path: 'pedidos',
          loadChildren: () => import('../orders/orders.config').then(x => x.OrdersModule)
        },
        {
          path: 'prescriptions',
          loadChildren: () => import('../prescriptions/prescriptions.config').then(x => x.PrescriptionsModule)
        },
        // {
        //   path: 'nurses',
        // },
        {
          path: 'clinicas',
          component: HomeClinicsCatalogRouteComponent,
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class HomeRoutingModule {}

@NgModule({
  declarations: [HomeComponent, HomeEventsCatalogRouteComponent, HomePatientsCatalogRouteComponent, HomeServicesCatalogRouteComponent, HomeProductsCatalogRouteComponent, HomeClinicsCatalogRouteComponent, ],
  imports: [HomeRoutingModule, BootstrapModule, CdkModule, RouterModule, CommonModule,
    TemplateModule, BreadcrumbLinkComponent, EventsCatalogComponent, MainAsideComponent, UsersCatalogComponent, ServicesCatalogComponent, ProductsCatalogComponent, AddressesCatalogComponent, ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule {}
