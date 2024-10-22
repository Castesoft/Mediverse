/// <reference types="@types/google.maps" />
// declare var google: any;
import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormNewModule } from 'src/app/_forms/_new/forms-new.module';
import { ControlTypeaheadComponent } from 'src/app/_forms/control-typeahead.component';
import { SelectOption } from 'src/app/_forms/form';
import { Search, SearchForm } from 'src/app/_models/search';
import { SearchService } from 'src/app/_services/search.service';
import { SpecialtiesService } from 'src/app/specialties/specialties.config';

@Component({
  selector: 'app-search-general',
  standalone: true,
  imports: [ControlTypeaheadComponent, ReactiveFormsModule, FormNewModule, CommonModule,],
  templateUrl: './search-general.component.html',
})
export class SearchGeneralComponent implements OnInit {
  private router = inject(Router);
  service = inject(SearchService);
  specialtiesService = inject(SpecialtiesService);

  compact = input(false);

  haveSelected = false;
  private autocompleteService!: google.maps.places.AutocompleteService;

  form = new SearchForm();

  constructor() {
    effect(() => {
      this.specialtiesService.getOptions().subscribe({
        next: response => {
          this.form.controls.specialty.selectOptions = this.specialtiesService.options();
        }
      })
    });

    this.form.patchValue(this.service.search());

    this.form.valueChanges.subscribe({
      next: value => {
        this.service.search.set(new Search({ ...value }));
      }
    })
  }

  async ngOnInit() {
    await google.maps.importLibrary("places");

  // Now you can safely access AutocompleteService
  this.autocompleteService = new google.maps.places.AutocompleteService();

    this.form.controls.location.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe({
      next: (value) => {
        if (!value) {
          this.form.controls.location.selectOptions = [];
          return;
        }

        this.getAutocompleteSuggestions(value as any);
        this.haveSelected = false;
      }
    });
  }

  private getAutocompleteSuggestions(input: string): void {
    if (this.haveSelected) return;

    this.autocompleteService.getPlacePredictions(
      { input, componentRestrictions: {country: ['mx']} },
      (
        predictions: google.maps.places.AutocompletePrediction[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        this.form.controls.location.selectOptions = predictions.map((prediction: google.maps.places.AutocompletePrediction) => {
          return new SelectOption({
            name: prediction.description,
            code: prediction.place_id,
          });
        });
      } else {
        this.form.controls.location.selectOptions = [];
      }
    });
  }

  onTypeaheadSelect(e: TypeaheadMatch<SelectOption>) {
    console.log(e);

    this.haveSelected = true;
    this.form.controls.location.selectOptions = [];
  }

  onSubmit() {
    this.router.navigate(['/search'], { queryParams: this.form.params });

    this.service.search.set(new Search({ ...this.form.value }));
  }
}
