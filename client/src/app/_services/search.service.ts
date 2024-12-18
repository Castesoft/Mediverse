import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, effect, inject, signal } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { createId } from '@paralleldrive/cuid2';
import { Observable, tap } from "rxjs";
import { AvailableDay } from 'src/app/_models/availableDay';
import { DoctorResult } from "src/app/_models/doctors/doctorResults/doctorResult";
import { DoctorScheduleFormPayload } from 'src/app/_models/doctorSchedules/doctorScheduleFormPayload';
import { SearchResults } from "src/app/_models/doctorSearchResults";
import { Event } from 'src/app/_models/events/event';
import { Search } from "src/app/_models/search/search";
import { SearchTabs } from 'src/app/_models/search/searchTypes';
import { getSearchHttpParams, getSearchRouteQueryParams } from 'src/app/_models/search/searchUtils';
import { UtilsService } from "src/app/_services/utils.service";
import { PaginatedResult, getPaginatedResult } from "src/app/_utils/serviceHelper/pagination/paginatedResult";
import { Pagination } from "src/app/_utils/serviceHelper/pagination/pagination";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);
  private utilsService = inject(UtilsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private matSnackBar = inject(MatSnackBar);

  constructor() {

  }

  baseUrl = `${environment.apiUrl}search/`;
  results = signal<SearchResults | null>(null);
  selected = signal<DoctorResult | null>(null);
  search = signal<Search>(new Search(createId()));
  pagination = signal<Pagination | null>(null);
  cache = new Map();
  quantity = signal<number>(0);
  loading = signal(false);

  data = signal<DoctorResult[]>([]);

  markers = signal<google.maps.marker.AdvancedMarkerElement[]>([]);
  hoveredMarker = signal<DoctorResult | null>(null);
  markersMap = signal<Map<DoctorResult, google.maps.marker.AdvancedMarkerElement[]>>(new Map<DoctorResult, google.maps.marker.AdvancedMarkerElement[]>());

  setSelected(doctor: DoctorResult | null) {
    const search = new Search(this.search().key, { ...this.search() });
    if (doctor) {
      search.result = new DoctorResult({ id: doctor.id, fullName: doctor.fullName });
    } else {
      search.result = new DoctorResult({ id: null, fullName: null });
    }

    this.search.set(search);
    if (doctor) {
      this.selected.set(new DoctorResult({...doctor}));
    } else {
      this.selected.set(null);
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: getSearchRouteQueryParams(this.search()),
      queryParamsHandling: 'replace'
    });
  }

  setSearchWithParamMap(paramMap: ParamMap) {
    const search = this.search();
    search.setFromQueryParamMap(paramMap);
    this.search.set(search);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: getSearchRouteQueryParams(this.search()),
      queryParamsHandling: 'merge'
    });

    this.getSearchResults().subscribe({
      next: results => {
        if (search.result.id) {
          const foundDoctor = this.findDoctorById(search.result.id);
          this.selected.set(foundDoctor);
          console.log('foundDoctor', foundDoctor);

          if (foundDoctor !== null) search.result = foundDoctor;

          this.search.set(search);

        }
      }
    });
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
    this.loading.set(true);

    const payloadParams: HttpParams = getSearchHttpParams(this.search());

    return getPaginatedResult<SearchResults>(`${this.baseUrl}`, payloadParams, this.http).pipe(
      tap((results) => {

        this.loading.set(false);

        if (results.result) {
          this.results.set(results.result);
          this.cache.set(Object.values(this.search()).join('-'), results.result);
          if (results.result.doctors.length === 0) this.search.set(new Search(this.search().key, { ...this.search(), pageNumber: 1 }));
          if (results.result.doctors.length === 0) {
            this.search.set(new Search(this.search().key, { ...this.search(), pageNumber: 1 }));
          } else {
            this.updateData(results.result.doctors);
          }
        }
        if (results.pagination) this.pagination.set(results.pagination);
      })
    );
  }

  isTabActive(tab: string): boolean {
    return this.search().tab === tab;
  }

  setTab(tab: SearchTabs) {
    this.search.set(new Search(this.search().key, { ...this.search(), tab: tab }));
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: getSearchRouteQueryParams(this.search()),
      queryParamsHandling: 'merge'
    });
  }

  getDoctorById(id: number): Observable<DoctorResult> {
    return this.http.get<DoctorResult>(`${this.baseUrl}${id}`);
  }

  getSpecialistsQuantity() {
    return this.http.get<number>(`${this.baseUrl}specialists-quantity`).pipe(
      tap((quantity) => this.quantity.set(quantity))
    );
  }

  private updateData(newDoctors: DoctorResult[]): void {
    const currentDoctors = this.data();
    const uniqueDoctors = [
      ...currentDoctors.filter(cd => !newDoctors.some(nd => nd.id === cd.id)),
      ...newDoctors
    ];

    this.data.set(uniqueDoctors);
  }

  private findDoctorById(id: number): DoctorResult | null {
    const currentDoctors = this.data();
    const doctor = currentDoctors.find(d => d.id === id);
    return doctor || null;
  }

  createEvent(model: DoctorScheduleFormPayload): Observable<Event> {
    return this.http.post<Event>(`${environment.apiUrl}events/search`, model).pipe(
      tap(response => {
        this.matSnackBar.open('Evento creado', 'Cerrar', { duration: 5000 });

        // update search
        this.search.update(oldValues => {

          const newInstance = Object.setPrototypeOf(oldValues, Search.prototype) as Search;
          newInstance.result = Object.setPrototypeOf(oldValues.result, DoctorResult.prototype) as DoctorResult;

          console.log('oldValues', oldValues);
          console.log('newInstance', newInstance);

          newInstance.eventId = response.id;

          newInstance.result.updateAvailableDayAndTime(oldValues.dayNumber, oldValues.scheduleOption);

          return newInstance;
        });

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: getSearchRouteQueryParams(this.search()),
          queryParamsHandling: 'merge'
        });

        // update results
      })
    );
  }
}
