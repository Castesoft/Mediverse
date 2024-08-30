/// <reference types="@types/google.maps" />
declare var google: any;
import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ControlTypeaheadComponent } from 'src/app/_forms/control-typeahead.component';
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
  private router = inject(Router);
  searchService = inject(SearchService);

  compact = input(false);
  selectedSpecialty = input('');
  selectedLocation = input('');
  selectedPlaceId = input('');
  disabled = input(false);
  onSearch = output<{specialty: string, location: string}>();
  onSetSpecialistsQuantity = output<number>();

  private autocompleteService: any;
  haveSelected = false;
  autocompleteResults: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  specialties: any[] = [];

  form = this.fb.group({
    specialty: [''],
    specialtyId: [''],
    location: [''],
    placeId: ['']
  });

  constructor() { 
  }
  
  async ngOnInit() {
    if (this.selectedSpecialty()) {
      this.form.get('specialty')?.setValue(this.selectedSpecialty());
    }
    if (this.selectedLocation() && this.selectedPlaceId()) {
      this.form.get('location')?.setValue(this.selectedLocation());
      this.form.get('placeId')?.setValue(this.selectedPlaceId());
    }

    const {AutocompleteService} = await google.maps.importLibrary("places")
    this.autocompleteService = new AutocompleteService();

    this.searchService.getSearchFields().subscribe({
      next: () => {
        this.onSetSpecialistsQuantity.emit(this.searchService.fields()?.specialistsQuantity || 0);
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

  onLocationTypeaheadBlur(e: TypeaheadMatch | undefined) {
    if (e) {
      this.haveSelected = true;
      this.form.get('location')?.setValue(e.item.name);
      this.form.get('placeId')?.setValue(e.item.value);
      this.autocompleteResults.next([]);
    }
  }

  onSpecialtyTypeaheadSelect(e: TypeaheadMatch | undefined) {
    if (e) {
      this.form.get('specialtyId')?.setValue(e.item.id);
      this.form.get('specialty')?.setValue(e.item.name);
    }
  }

  onSubmit() {
    if (this.form.get('location')?.value === '') {
      this.form.get('placeId')?.setValue('');
    }
    const params: any = {};
    if (this.form.get('specialty')?.value) params['specialty'] = this.form.get('specialty')?.value;
    if (this.form.get('placeId')?.value) params['location'] = this.form.get('placeId')?.value;
    if (this.form.get('location')?.value) params['locationName'] = this.form.get('location')?.value;
    this.router.navigate(['/search'], { queryParams: params });
    this.onSearch.emit(params);
  }
}
