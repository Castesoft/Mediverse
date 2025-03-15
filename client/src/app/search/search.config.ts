import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TemplateModule } from '../_shared/template/template.module';
import { HomeSearchComponent } from './components/home-search.component';

@Component({
  selector: 'search-route',
  template: `
    <router-outlet></router-outlet>`,
  standalone: false,
})
export class SearchComponent implements OnInit {
  ngOnInit(): void { }
}

@NgModule({
  imports: [ RouterModule.forChild([
    {
      path: '', title: 'Búsqueda', data: { breadcrumb: 'Búsqueda', },
      component: SearchComponent, runGuardsAndResolvers: 'always',
      children: [
        {
          path: '',
          component: HomeSearchComponent,
          title: 'Búsqueda de especialista',
          data: { breadcrumb: 'Especialista', },
        },
      ],
    },
  ]) ],
  exports: [ RouterModule ]
})
export class SearchRoutingModule {
}

@NgModule({
  declarations: [
    SearchComponent,
  ],
  imports: [ CommonModule, SearchRoutingModule, TemplateModule, ]
})
export class SearchModule {
}
