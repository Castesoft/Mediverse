import { CommonModule } from '@angular/common';
import { Component, inject, NgModule, OnInit } from '@angular/core';
import { ResolveFn, RouterModule } from '@angular/router';
import { LayoutModule } from '../_shared/layout.module';
import { SearchGeneralComponent } from './components/search-general/search-general.component';
import { HomeSearchComponent } from './components/home-search/home-search.component';

@Component({
    selector: 'search-route',
    template: `
      <router-outlet></router-outlet>`,
  })
  export class SearchComponent implements OnInit {
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
        path: '', title: 'Búsqueda', data: { breadcrumb: 'Búsqueda', },
        component: SearchComponent, runGuardsAndResolvers: 'always',
        children: [
          { path: '', component: HomeSearchComponent, title: 'Búsqueda de especialista', data: { breadcrumb: 'Especialista', }, },
        //   { path: 'create', component: PrescriptionNewComponent, title: 'Crear nueva receta', data: { breadcrumb: 'Nuevo', }, },
        //   {
        //     path: ':id', title: titleDetailResolver, data: { breadcrumb: 'Detalle', },
        //     component: PrescriptionDetailsComponent,
        //     resolve: { item: itemResolver },
        //   },
        //   {
        //     path: ':id/edit', title: titleEditResolver, data: { breadcrumb: 'Editar', },
        //     component: PrescriptionEditComponent,
        //     resolve: { item: itemResolver },
        //   },
        ],
      },
    ])],
    exports: [RouterModule]
  })
  export class SearchRoutingModule {
  }

@NgModule({
    declarations: [
      SearchComponent,
    ],
    imports: [CommonModule, SearchRoutingModule, LayoutModule,]
  })
  export class SearchModule {
  }
