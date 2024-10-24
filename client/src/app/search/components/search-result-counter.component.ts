import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { SearchService } from "src/app/_services/search.service";

@Component({
  host: { class: 'd-flex flex-wrap flex-stack mb-1', },
  selector: 'div[searchResultCounter]',
  templateUrl: './search-result-counter.component.html',
  standalone: true,
  imports: [CommonModule,],
})
export class SearchResultCounterComponent {
  service = inject(SearchService);
}
