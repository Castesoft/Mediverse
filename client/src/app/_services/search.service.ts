import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, tap } from 'rxjs';
import { SearchResults } from 'src/app/_models/doctorSearchResults';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { Search } from 'src/app/_models/search';
import { getPaginatedResult } from 'src/app/_utils/util';
import { DoctorResult } from 'src/app/_models/doctorResult';
import { UtilsService } from 'src/app/_services/utils.service';
import { Doctor } from 'src/app/_models/doctor';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);
  private utilsService = inject(UtilsService);

  baseUrl = `${environment.apiUrl}search/`;
  results = signal<SearchResults | null>(null);
  selected = signal<DoctorResult | null>(null);
  search = signal<Search>(new Search());
  pagination = signal<Pagination | null>(null);
  cache = new Map();
  quantity = signal<number>(0);
  loading = signal(false);

  markers = signal<google.maps.marker.AdvancedMarkerElement[]>([]);
  hoveredMarker = signal<DoctorResult | null>(null);
  markersMap = signal<Map<DoctorResult, google.maps.marker.AdvancedMarkerElement[]>>(new Map<DoctorResult, google.maps.marker.AdvancedMarkerElement[]>());

  setSelected(doctor: DoctorResult | null) {
    this.search.set(new Search({ ...this.search(), doctor: new Doctor({ id: doctor?.id, fullName: `${doctor?.firstName} ${doctor?.lastName}` }) }));
    this.selected.set(doctor);
  }

  resetMarkers() {
    this.markers.set([]);
  }

  resetMarkerIcons(doctor: DoctorResult) {
    const map = this.markersMap();
    const doctorMarkers = map.get(doctor);
    if (doctorMarkers) {
      doctorMarkers.forEach((marker) => {
        marker.content = null;
        marker.zIndex = 0;
      });
      map.set(doctor, doctorMarkers);
      this.markersMap.set(map);
    }
  }

  open(doctor: DoctorResult) {
    this.setSelected(doctor);
    const map = this.markersMap();
    map.forEach((_, doctor) => {
      this.resetMarkerIcons(doctor);
    });
    this.markersMap.set(map);
    this.transformMarkerIcons(doctor);
  }

  onLeave(doctor: DoctorResult) {
    const selected = this.selected();
    if (selected) {
      if (selected.id !== doctor.id) {
        this.resetMarkerIcons(doctor);
      }
    }
  }

  onHover(doctor: DoctorResult) {
    this.transformMarkerIcons(doctor);
  }

  openOnMap(doctor: DoctorResult): Observable<{ latitude: number, longitude: number }> {
    this.setSelected(doctor);
    const map = this.markersMap();
    map.forEach((_, doctor) => {
      this.resetMarkerIcons(doctor);
    });
    this.markersMap.set(map);
    this.transformMarkerIcons(doctor);

    // this.showMobileSearch.set(false);

    return new Observable(observer => {
      observer.next({
        latitude: doctor.addresses[0].latitude!,
        longitude: doctor.addresses[0].longitude!
      });
      observer.complete();
    });
  }

  close() {
    this.setSelected(null);
    const map = this.markersMap();
    map.forEach((_, doctor) => {
      this.resetMarkerIcons(doctor);
    });
    this.markersMap.set(map);
  }

  transformMarkerIcons(doctor: DoctorResult) {
    const map = this.markersMap();

    const doctorMarkers = map.get(doctor);

    if (doctorMarkers) {
      doctorMarkers.forEach((maker) => {
        const range = document.createRange();
        const fragment = range.createContextualFragment(doctor.photoUrl ? `
          <div class="symbol symbol-circle symbol-60px min-w-60px doctor-map-marker" style="cursor: pointer;">
            <img src="${doctor.photoUrl}" alt="${doctor.firstName}" style="width: 60px;height: 60px;border-radius: 50%;overflow: hidden;">
          </div>
        ` : `
          <div class="symbol symbol-circle symbol-60px min-w-60px doctor-map-marker" style="cursor: pointer;">
            <div class="symbol-label fw-semibold text-primary fs-2x bg-light-${this.utilsService.getBootstrapClass(doctor.firstName!)} text-${this.utilsService.getBootstrapClass(doctor.firstName!)}">
              ${doctor.firstName![0]}
            </div>
          </div>
        `);
        maker.content = fragment;
        maker.zIndex = doctor === this.selected() ? 101 : 100;
      });

      map.set(doctor, doctorMarkers);
      this.markersMap.set(map);
    }
  }

  setMarkerToMap(doctor: DoctorResult, marker: google.maps.marker.AdvancedMarkerElement) {
    const map = this.markersMap();
    map.set(doctor, [marker]);
    this.markersMap.set(map);
  }

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
