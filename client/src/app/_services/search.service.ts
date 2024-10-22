import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, of, tap } from 'rxjs';
import { DoctorSearchResult, DoctorSearchResults } from 'src/app/_models/doctorSearchResults';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { Search } from 'src/app/_models/search';
import { getPaginatedResult } from 'src/app/_utils/util';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);

  baseUrl = `${environment.apiUrl}search/`;
  results = signal<DoctorSearchResults | null>(null);
  search = signal<Search>(new Search());
  searchResultsPagination = signal<Pagination | null>(null);
  searchResultsCache = new Map();
  quantity = signal<number>(0);

  getSearchResults(options: {ignoreCache: boolean} = {ignoreCache: false}): Observable<PaginatedResult<DoctorSearchResults>> {
    const response: DoctorSearchResults = this.searchResultsCache.get(Object.values(this.search()).join('-'));

    if (response && !options.ignoreCache) {
      this.results.set(response);
      return of({
        result: response,
        pagination: this.searchResultsPagination()!
      });
    }

    return getPaginatedResult<DoctorSearchResults>(`${this.baseUrl}`, this.search().httpParams, this.http).pipe(
      tap((results) => {
        if (results.result) {
          this.results.set(results.result);
          this.searchResultsCache.set(Object.values(this.search()).join('-'), results.result);
          if (results.result.doctors.length === 0) this.search.set(new Search({ ...this.search(), pageNumber: 1 }));
        }
        if (results.pagination) this.searchResultsPagination.set(results.pagination);
      })
    );
  }

  getDoctorById(id: number): Observable<DoctorSearchResult> {
    return this.http.get<DoctorSearchResult>(`${this.baseUrl}${id}`);
  }

  getSpecialistsQuantity() {
    return this.http.get<number>(`${this.baseUrl}specialists-quantity`).pipe(
      tap((quantity) => this.quantity.set(quantity))
    );
  }
}
