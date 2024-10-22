import { CommonModule } from "@angular/common";
import { Component, inject, NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";
import { View } from "src/app/_models/types";
import { OccupationsCatalogComponent } from "src/app/occupations/occupations.config";

@Component({
  selector: 'admin-home-route',
  template: `
    <div class="container">
      <nav class="mb-2" aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><a routerLink="/admin">Admin</a></li>
        </ol>
      </nav>

      <h1>Admin</h1>

      <div class="row row-cols-1 g-4">
      <div class="col">
        <ul>
          <li><a routerLink="/admin/utilerias/codigos/codigos-cero">Códigos 0</a></li>
          <li><a routerLink="/admin/utilerias/codigos/codigos-uno">Códigos 1</a></li>
          <li><a routerLink="/admin/utilerias/codigos/codigos-dos">Códigos 2</a></li>
          <li><a routerLink="/admin/utilerias/codigos/consecutivos">Consecutivos</a></li>
          <li><a routerLink="/admin/utilerias/codigos/categorias">Categorías</a></li>
          <li><a routerLink="/admin/utilerias/codigos/colores-cuerpo">Colores de Cuerpo</a></li>
          <li><a routerLink="/admin/utilerias/codigos/colores-cara">Colores de Cara</a></li>
          <li><a routerLink="/admin/utilerias/codigos/razas">Razas</a></li>
          <li><a routerLink="/admin/utilerias/codigos/cuernos">Cuernos</a></li>
          <li><a routerLink="/admin/utilerias/codigos/estados">Estados</a></li>
          <li><a routerLink="/admin/utilerias/codigos/localizaciones">Localizaciones</a></li>
          <li><a routerLink="/admin/utilerias/codigos/asociaciones-nacionales">Asociaciones Nacionales</a></li>
          <li><a routerLink="/admin/utilerias/codigos/asociaciones-internacionales">Asociaciones Internacionales</a></li>
          <li><a routerLink="/admin/utilerias/codigos/etapas">Etapas</a></li>
          <li><a routerLink="/admin/utilerias/codigos/tipos-de-venta">Tipos de Venta</a></li>
          <li><a routerLink="/admin/utilerias/codigos/causas-de-venta">Causas de Venta</a></li>
        </ul>
      </div>
      <div class="col">
        @defer{<div occupationsCatalog [mode]="'view'" [key]="occupationsKey" [view]="view"></div>}
      </div>
    </div>
    </div>
  `,
  standalone: true,
  imports: [ CommonModule, RouterModule, OccupationsCatalogComponent, ],
})
export class HomeComponent {
  private router = inject(Router);

  view: View = 'page';
  occupationsKey = `${this.router.url}#occupations`;
  substancesKey = `${this.router.url}#substances`;
  diseasesKey = `${this.router.url}#diseases`;
  maritalStatusesKey = `${this.router.url}#maritalStatuses`;
  colorBlindnessesKey = `${this.router.url}#colorBlindnesses`;
  relativeTypesKey = `${this.router.url}#relativeTypes`;
  consumptionLevelsKey = `${this.router.url}#consumptionLevels`;
}

@Component({
  selector: 'admin-route',
  template: `<router-outlet></router-outlet>`,
})
export class AdminComponent {}

@NgModule({
  imports: [ RouterModule.forChild([
    {
      path: '',
      component: HomeComponent,
      title: 'Admin',
    },
    {
      path: 'occupations',
      loadChildren: () => import('../occupations/occupations.config').then(m => m.OccupationsModule),
      title: 'Ocupaciones',
    }
  ] as Routes)],
  exports: [ RouterModule ],
})
export class AdminRoutingModule {}

@NgModule({
  declarations: [ AdminComponent, ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
  ],
  exports: [],
})
export class AdminModule {}
