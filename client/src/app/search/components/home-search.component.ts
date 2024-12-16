import { CommonModule } from '@angular/common';
import { SearchService } from 'src/app/_services/search.service';
import { Component, inject } from '@angular/core';
import { SearchFormComponent } from 'src/app/search/components/search-form.component';

@Component({
  selector: 'app-home-search',
  standalone: true,
  imports: [SearchFormComponent, CommonModule],
  templateUrl: './home-search.component.html',
})
export class HomeSearchComponent {
  service = inject(SearchService);

  constructor() {

  }

}
