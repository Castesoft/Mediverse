import { Component, model, NgModule } from '@angular/core';
import { NamingSubject } from 'src/app/_models/base/namingSubject';
import { CatalogMode } from 'src/app/_models/base/types';

@Component({
  host: { class: 'mb-4' },
  selector: 'h1[title]',
  template: `
    @switch (mode()) {
      @case ('view') {
        {{ naming().title }}
      }
      @case ('select') {
        Seleccione {{naming().articles.undefinedSingular}} {{ naming().singular }}
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
  mode = model.required<CatalogMode>();
  naming = model.required<NamingSubject>();
}

@NgModule({
  imports: [ CatalogTitleComponent ],
  exports: [ CatalogTitleComponent ],
})
export class CatalogModule { }
