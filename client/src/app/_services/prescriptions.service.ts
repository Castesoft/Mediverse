import { inject, Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Observable, tap } from "rxjs";
import { Event } from "src/app/_models/event";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PrescriptionsService {
  private http = inject(HttpClient);

  baseUrl = `${environment.apiUrl}prescriptions/`;

  constructor() { }

  create(formData: any, doctorId: number): Observable<Event> {
    console.log('formData', formData);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Event>(`${this.baseUrl}${doctorId}`, formData, { headers }).pipe(
      tap(response => {
        return response;
      })
    );
  }
}
