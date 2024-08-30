import { Component } from '@angular/core';
import { SearchGeneralComponent } from '../search-general/search-general.component';

@Component({
  selector: 'app-home-search',
  standalone: true,
  imports: [SearchGeneralComponent],
  templateUrl: './home-search.component.html',
  styleUrl: './home-search.component.scss'
})
export class HomeSearchComponent {
  specialistsQuantity = 0;

  setSpecialistsQuantity(quantity: number) {
    this.specialistsQuantity = quantity;
  }
}
