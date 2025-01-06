import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, input, effect, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { SelectOption } from "src/app/_models/base/selectOption";
import { DoctorResult } from "src/app/_models/doctors/doctorResults/doctorResult";
import { SearchForm } from "src/app/_models/search/searchForm";
import { Search } from "src/app/_models/search/search";
import { SearchService } from "src/app/_services/search.service";
import { SpecialtiesService } from "src/app/specialties/specialties.config";
import { Forms2Module } from "src/app/_forms2/forms-2.module";

@Component({
  selector: 'div[searchForm]',
  standalone: true,
  imports: [ ReactiveFormsModule, Forms2Module, CommonModule, ],
  templateUrl: './search-form.component.html',
  styleUrls: [ './search-form.component.scss' ]
})
export class SearchFormComponent implements OnInit {
  private router = inject(Router);
  service = inject(SearchService);
  specialtiesService = inject(SpecialtiesService);

  compact = input(false);

  fromWrapper = signal<boolean>(false);

  haveSelected = false;
  private autocompleteService!: google.maps.places.AutocompleteService;

  form = new SearchForm();

  constructor() {
    effect(() => {
      this.specialtiesService.getOptions().subscribe({
        next: _ => {
          this.form.controls.specialty.selectOptions = this.specialtiesService.options();
        }
      })
    });

    this.form.patchValue(this.service.search());
  }

  async ngOnInit() {
    await google.maps.importLibrary("places");

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
      { input, componentRestrictions: { country: [ 'mx' ] } },
      (
        predictions: google.maps.places.AutocompletePrediction[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          this.form.controls.location.selectOptions = predictions.map((prediction: google.maps.places.AutocompletePrediction): SelectOption => {
            return new SelectOption({ name: prediction.description, code: prediction.place_id });
          });
        } else {
          this.form.controls.location.selectOptions = [];
        }
      });
  }

  onSubmit(): void {
    this.router.navigate([ '/search' ], { queryParams: this.form.getParams() }).then((): void => { });

    this.service.search.set(new Search(this.service.search().key, {
      ...this.form.value,
      result: new DoctorResult({ ...this.form.controls.result.value, } as any)
    }));
    this.service.getSearchResults({ ignoreCache: true }).subscribe();
  }
}
