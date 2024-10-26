import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { SearchService } from "src/app/_services/search.service";
import { TableModule } from "src/app/_shared/table/table.module";
import { LoadingPlaceholderComponent } from "src/app/search/components/loading-placeholder.component";
import { NoResultScreenComponent } from "src/app/search/components/no-result-screen.component";
import { ResultRowComponent } from "src/app/search/components/result-row.component";
import { SearchFormComponent } from "src/app/search/components/search-form.component";
import { SearchResultCounterComponent } from "src/app/search/components/search-result-counter.component";

@Component({
  host: { class: 'd-flex flex-column position-relative', },
  selector: 'div[doctorResultsWindow]',
  templateUrl: './doctor-results-window.component.html',
  styleUrl: './doctor-results-window.component.scss',
  standalone: true,
  imports: [ CommonModule, ResultRowComponent, SearchFormComponent, NoResultScreenComponent, LoadingPlaceholderComponent, TableModule,
    SearchResultCounterComponent,
   ],
})
export class DoctorResultsWindowComponent {
  service = inject(SearchService);
}
