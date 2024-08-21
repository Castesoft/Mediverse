import { Component, input, NgModule } from '@angular/core';
import { CatalogMode, NamingSubject } from 'src/app/_models/types';

@Component({
  host: { class: 'mb-4' },
  selector: 'h1[title]',
  template: `
    @switch (mode()) {
      @case ('view') {
        {{ naming().title }}
      }
      @case ('select') {
        Seleccione {{naming().undefinedArticle}} {{ naming().singular }}
      }
      @case ('multiselect') {
        Seleccione {{ naming().plural }}
      }
      @case ('readonly') {
        {{ naming().title }}
      }
    }
  `,
  standalone: true,
})
export class CatalogTitleComponent {
  mode = input.required<CatalogMode>();
  naming = input.required<NamingSubject>();
}

@NgModule({
  imports: [ CatalogTitleComponent ],
  exports: [ CatalogTitleComponent ],
})
export class CatalogModule { }
