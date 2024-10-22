import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, of, tap } from 'rxjs';
import { DoctorResult, SearchResults } from 'src/app/_models/doctorSearchResults';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { Search } from 'src/app/_models/search';
import { getPaginatedResult } from 'src/app/_utils/util';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);

  baseUrl = `${environment.apiUrl}search/`;
  results = signal<SearchResults | null>(null);
  selected = signal<DoctorResult | null>(null);
  search = signal<Search>(new Search());
  pagination = signal<Pagination | null>(null);
  cache = new Map();
  quantity = signal<number>(0);
  loading = signal(false);

  getSearchResults(options: {ignoreCache: boolean} = {ignoreCache: false}): Observable<PaginatedResult<SearchResults>> {
    // const response: SearchResults = this.cache.get(Object.values(this.search()).join('-'));

    // if (response && !options.ignoreCache) {
    //   this.results.set(response);
    //   return of({
    //     result: response,
    //     pagination: this.pagination()!
    //   });
    // }

    this.loading.set(true);

    return getPaginatedResult<SearchResults>(`${this.baseUrl}`, this.search().httpParams, this.http).pipe(
      tap((results) => {

        this.loading.set(false);

        if (results.result) {
          this.results.set(results.result);
          this.cache.set(Object.values(this.search()).join('-'), results.result);
          if (results.result.doctors.length === 0) this.search.set(new Search({ ...this.search(), pageNumber: 1 }));
        }
        if (results.pagination) this.pagination.set(results.pagination);
      })
    );
  }

  getDoctorById(id: number): Observable<DoctorResult> {
    return this.http.get<DoctorResult>(`${this.baseUrl}${id}`);
  }

  getSpecialistsQuantity() {
    return this.http.get<number>(`${this.baseUrl}specialists-quantity`).pipe(
      tap((quantity) => this.quantity.set(quantity))
    );
  }
}
