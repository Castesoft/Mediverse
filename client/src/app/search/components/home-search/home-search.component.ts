import { Component, effect, inject, signal } from '@angular/core';
import { SearchGeneralComponent } from '../search-general/search-general.component';
import { CommonModule } from '@angular/common';
import { SearchService } from 'src/app/_services/search.service';
import { Search } from 'src/app/_models/search';

@Component({
  selector: 'app-home-search',
  standalone: true,
  imports: [SearchGeneralComponent, CommonModule],
  templateUrl: './home-search.component.html',
  styleUrl: './home-search.component.scss'
})
export class HomeSearchComponent {
  service = inject(SearchService);

  search = signal<Search>(new Search());

  constructor() {

  }

}
