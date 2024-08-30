import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchFields } from '../_models/searchFields';
import { Observable, of, tap } from 'rxjs';
import { DoctorSearchResult, DoctorSearchResultParams, DoctorSearchResultParamsToHttpParams, DoctorSearchResults } from '../_models/doctorSearchResults';
import { getPaginatedResult } from '../_utils/util';
import { PaginatedResult, Pagination } from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);

  baseUrl = `${environment.apiUrl}search/`;
  fields = signal<SearchFields | null>(null);
  searchResults = signal<DoctorSearchResults | null>(null);
  searchResultsParams = signal<DoctorSearchResultParams>(new DoctorSearchResultParams('', ''));
  searchResultsPagination = signal<Pagination | null>(null);
  searchResultsCache = new Map();

  getSearchFields() {
    return this.http.get<SearchFields>(`${this.baseUrl}fields`).pipe(
      tap((fields) => this.fields.set(fields))
    );
  }

  getSearchResults(params: DoctorSearchResultParams, options: {ignoreCache: boolean} = {ignoreCache: false}): Observable<PaginatedResult<DoctorSearchResults>> {
    this.searchResultsParams.set(params);
    const response: DoctorSearchResults = this.searchResultsCache.get(Object.values(params).join('-'));

    if (response && !options.ignoreCache) {
      this.searchResults.set(response);
      return of({
        result: response,
        pagination: this.searchResultsPagination()!
      });
    }

    return getPaginatedResult<DoctorSearchResults>(`${this.baseUrl}`, DoctorSearchResultParamsToHttpParams(params), this.http).pipe(
      tap((results) => {
        if (results.result) {
          this.searchResults.set(results.result);
          this.searchResultsCache.set(Object.values(params).join('-'), results.result);
        }
        if (results.pagination) this.searchResultsPagination.set(results.pagination);
      })
    );
  }

  getDoctorById(id: number): Observable<DoctorSearchResult> {
    return this.http.get<DoctorSearchResult>(`${this.baseUrl}${id}`);
  }
}
