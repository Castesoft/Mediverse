import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, NgModule, OnInit } from '@angular/core';
import { ResolveFn, RouterModule } from '@angular/router';
import { LayoutModule } from '../_shared/layout.module';
import { LandingComponent } from './components/landing.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';

@Component({
    selector: 'landing-route',
    template: `
      <router-outlet></router-outlet>`,
  })
  export class LadingRouterComponent implements OnInit {
    ngOnInit(): void { }
  }

// export const itemResolver: ResolveFn<Prescription | null> = (route, state) => {
//     const prescription = inject(PrescriptionsService);
//     const id = +route.paramMap.get('id')!;
//     const edited = route.queryParamMap.get('edited');
//     return prescription.getById(id, { noCache: edited ? true : false });
//   };
  
//   export const titleDetailResolver: ResolveFn<string> = (route, state) => {
//     const prescription = inject(PrescriptionsService);
//     const id = +route.paramMap.get('id')!;
//     prescription.getById(id).subscribe();
//     const item = prescription.getCurrent();
//     if (!item) return 'Detalle de receta';
//     const title = `Detalle de receta - ${item.id}`;
//     return title;
//   }
  
//   export const titleEditResolver: ResolveFn<string> = (route, state) => {
//     const prescription = inject(PrescriptionsService);
//     const id = +route.paramMap.get('id')!;
//     prescription.getById(id).subscribe();
//     const item = prescription.getCurrent();
//     if (!item) return 'Editar receta';
//     const title = `Editar receta - ${item.id}`;
//     return title;
//   }

@NgModule({
    imports: [RouterModule.forChild([
      {
        path: '', title: 'Mediverse', data: { breadcrumb: 'Landing', },
        component: LadingRouterComponent, runGuardsAndResolvers: 'always',
        children: [
          { path: '', component: LandingComponent, title: 'Mediverse', data: { breadcrumb: 'Landing', }, },
          { path: 'search', component: SearchResultsComponent, title: 'Especialistas', data: { breadcrumb: 'Landing', }, },
        ],
      },
    ])],
    exports: [RouterModule]
  })
  export class LadingRoutingModule {
  }

@NgModule({
    declarations: [
      LadingRouterComponent,
    ],
    imports: [CommonModule, LadingRoutingModule, LayoutModule,]
  })
  export class LadingModule {
  }
