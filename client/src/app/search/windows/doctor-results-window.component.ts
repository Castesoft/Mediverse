import { CommonModule } from "@angular/common";
import { Component, effect, HostBinding, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MobileQueryService } from 'src/app/_services/mobile-query.service';
import { SearchService } from "src/app/_services/search.service";
import { LogoIconComponent } from 'src/app/_shared/components/logo-icon/logo-icon.component';
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { LoadingPlaceholderComponent } from "src/app/search/components/loading-placeholder.component";
import { NoResultScreenComponent } from "src/app/search/components/no-result-screen.component";
import { ResultRowComponent } from "src/app/search/components/result-row.component";
import { SearchFormComponent } from "src/app/search/components/search-form.component";

@Component({
  selector: 'div[doctorResultsWindow]',
  templateUrl: './doctor-results-window.component.html',
  styleUrl: './doctor-results-window.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ResultRowComponent,
    SearchFormComponent,
    NoResultScreenComponent,
    LoadingPlaceholderComponent,
    TablesModule,
    RouterModule,
    LogoIconComponent,
  ],
})
export class DoctorResultsWindowComponent {
  readonly service: SearchService = inject(SearchService);
  readonly query = inject(MobileQueryService);

  class = 'd-flex flex-column position-relative';

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {

      if (this.query.isMobile() === true) {
        this.class = 'd-flex flex-column position-relative mobile-view';
      } else if (this.query.isMobile() === false) {
        this.class = 'd-flex flex-column position-relative desktop-view';
      }

    });
  }

}
