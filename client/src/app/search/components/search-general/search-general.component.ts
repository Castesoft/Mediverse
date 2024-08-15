declare var google: any;
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ControlTypeaheadComponent } from 'src/app/_forms/control-typeahead.component';
import { Specialty } from 'src/app/_models/specialty';
import { SearchService } from 'src/app/_services/search.service';

@Component({
  selector: 'app-search-general',
  standalone: true,
  imports: [ControlTypeaheadComponent, ReactiveFormsModule],
  templateUrl: './search-general.component.html',
  styleUrl: './search-general.component.scss'
})
export class SearchGeneralComponent implements OnInit {
  private fb = inject(FormBuilder);
  searchService = inject(SearchService);

  private autocompleteService: any;
  haveSelected = false;
  autocompleteResults: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  specialties: any[] = [];

  form = this.fb.group({
    specialty: [''],
    location: [''],
    placeId: ['']
  });

  constructor() { 
    this.autocompleteService = new google.maps.places.AutocompleteService();
  }

  ngOnInit(): void {
    this.searchService.getSearchFields().subscribe({
      next: () => {
        this.specialties = this.searchService.fields()?.specialties || [];
      }
    });

    this.form.get('location')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe({
      next: (value) => {
        if (!value) {
          this.autocompleteResults.next([]);
          return;
        }

        this.getAutocompleteSuggestions(value);
        this.haveSelected = false;
      }
    });
  }

  private getAutocompleteSuggestions(input: string): void {
    if (this.haveSelected) return;

    this.autocompleteService.getPlacePredictions({ input, componentRestrictions: {country: ['mx']} }, (predictions: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        this.autocompleteResults.next(predictions.map((prediction: any) => {
          return {
            name: prediction.description,
            value: prediction.place_id,
            data: prediction
          };
        }));
      } else {
        this.autocompleteResults.next([]);
      }
    });
  }

  onTypeaheadSelect(e: TypeaheadMatch) {
    this.haveSelected = true;
    this.form.get('placeId')?.setValue(e.item.value);
    this.autocompleteResults.next([]);
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
