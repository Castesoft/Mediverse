import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchFields } from '../_models/searchFields';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);
  
  baseUrl = `${environment.apiUrl}search/`;
  fields = signal<SearchFields | null>(null);
  
  getSearchFields() {
    return this.http.get<any>(`${this.baseUrl}`).pipe(
      tap((fields) => this.fields.set(fields))
    );
  }
}
