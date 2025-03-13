/// <reference types="@types/google.maps" />
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { SearchResults } from 'src/app/_models/doctorSearchResults';
import { SearchService } from 'src/app/_services/search.service';
import { CommonModule } from '@angular/common';
import { AccountService } from 'src/app/_services/account.service';
import { BsDropdownDirective, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Search } from "src/app/_models/search/search";
import { DoctorResult } from "src/app/_models/doctors/doctorResults/doctorResult";
import { SearchAuthComponent } from 'src/app/search/components/search-auth.component';
import { Subject } from 'rxjs';
import { DoctorDetailWindowComponent } from 'src/app/search/windows/doctor-detail-window.component';
import { DoctorScheduleWindowComponent } from 'src/app/search/windows/doctor-schedule-window.component';
import { AvailableDay } from 'src/app/_models/availableDay';
import { DoctorResultsWindowComponent } from 'src/app/search/windows/doctor-results-window.component';
import { Theme, ThemeService } from 'src/app/_services/theme.service';
import { getSearchRouteQueryParams } from 'src/app/_models/search/searchUtils';
import { AvailableTime } from 'src/app/_models/availableTime';
import { MobileQueryService } from 'src/app/_services/mobile-query.service';

@Component({
  selector: 'div[searchResults]',
  host: { class: 'h-100 d-flex mobile-view w-100', },
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
  providers: [ BsDropdownDirective, ],
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule,
    SearchAuthComponent,
    DoctorDetailWindowComponent,
    DoctorScheduleWindowComponent,
    DoctorResultsWindowComponent,
  ],
})
export class SearchResultsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly service = inject(SearchService);
  readonly accountService = inject(AccountService);
  readonly theme = inject(ThemeService);
  readonly query = inject(MobileQueryService);

  destroyed = new Subject<void>();
  showMobileSearch = signal(false);
  didSchedule = signal(false);
  scheduleWindowOpen = signal(false);
  selectedSchedule = signal<AvailableDay | null>(null);
  selectedTime = signal<AvailableTime | null>(null);

  startingTab = 'general';

  map?: google.maps.Map;

  mapOptions: google.maps.MapOptions = {
    colorScheme: 'FOLLOW_SYSTEM',
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    mapId: "8aab1a49ed502607",
  } as google.maps.MapOptions;

  constructor() {
    effect(() => {
      this.setMarkersAndPosition();
    });
  }

  getTheme(theme: Theme): google.maps.ColorScheme {
    switch (theme) {
      case 'dark':
        return google.maps.ColorScheme.DARK;
      case 'light':
        return google.maps.ColorScheme.LIGHT;
      default:
        return google.maps.ColorScheme.FOLLOW_SYSTEM;
    }
  }

  async ngOnInit() {
    this.service.setSearchWithParamMap(this.route.snapshot.queryParamMap);

    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    this.map = new Map(document.getElementById("map") as HTMLElement, {
      center: { lat: 22.5799, lng: -103.1648 },
      zoom: 6,
      ...this.mapOptions,
      colorScheme: this.getTheme(this.theme.theme()),
    } as google.maps.MapOptions);

    if (this.query.isMobile() && (this.service.search().location || this.service.search().specialty)) {
      this.showMobileSearch.set(true);
    }
  }

  setMarkersAndPosition() {
    this.service.resetMarkers();
    const results: SearchResults | null = this.service.results();
    const selected: DoctorResult | null = this.service.selected();
    if (results) {
      const currentZoom: number = this.map?.getZoom() || 12;
      if (results.latitude !== null && results.longitude !== null) {
        this.map?.setCenter({ lat: results.latitude, lng: results.longitude });
        this.map?.setZoom(currentZoom);
      } else {
        this.map?.setZoom(currentZoom);
      }

      if (results.doctors.length > 0) {
        if (selected && this.didSchedule()) {
          this.service.close();
          this.startingTab = 'schedule';
          setTimeout(() => { this.service.open(selected); }, 10);
          setTimeout(() => { this.startingTab = 'general'; }, 100);
        }
        for (const doctor of results.doctors) {
          this.showMarker(doctor).then(() => {});
        }
      }
    }

    if (this.service.selected() !== null) {
      const params: Params = getSearchRouteQueryParams(this.service.search());

      if (this.service.search().result.availableDays.length > 0) {
        let dayNumber = params['dayNumber'];
        let scheduleOption = params['scheduleOption'];


        if (dayNumber && scheduleOption) {
          dayNumber = parseInt(dayNumber);
          scheduleOption = parseInt(scheduleOption);

          if (this.service.search().result.availableDays.some(d => d.dayNumber === dayNumber)) {
            const day = this.service.search().result.availableDays.find(d => d.dayNumber === dayNumber);

            if (day) {
              if (day.availableTimes.length > scheduleOption) {
                this.selectedSchedule.set(day);
                this.selectedTime.set(day.availableTimes[scheduleOption]);
              }
            }
          }
        }
      }
    }
  }

  onSearchChange(event: Search) {
    this.service.search.set(new Search(this.service.search().key, { ...event }));

    this.service.resetMarkers();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: getSearchRouteQueryParams(this.service.search()),
      queryParamsHandling: 'merge'
    });

    if (this.query.isMobile()) {
      this.showMobileSearch.set(true);
    }

    this.setMarkersAndPosition();
  }

  async showMarker(doctor: DoctorResult) {
    if (this.map) {
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      for (const address of doctor.addresses) {
        const marker = new AdvancedMarkerElement({
          position: { lat: address.latitude!, lng: address.longitude! },
          map: this.map,
          title: `${doctor.firstName} ${doctor.lastName}`
        });

        marker.addListener("click", () => {
          this.service.open(doctor);
          this.service.hoveredMarker.set(null);
          if (this.query.isMobile() && this.service.selected()) {
            this.showMobileSearch.set(true);
          }
        });

        marker.content?.addEventListener("mouseenter", () => {
          this.service.hoveredMarker.set(doctor);
        });

        marker.content?.addEventListener("mouseleave", () => {
          this.service.hoveredMarker.set(null);
        });

        this.service.markers.set([ ...this.service.markers(), marker ]);
        const doctorMarkers = this.service.markersMap().get(doctor);
        if (doctorMarkers) {
          doctorMarkers.push(marker);
        } else {
          this.service.setMarkerToMap(doctor, marker);
        }
      }
    }
  }

  onEventCreated() {
    this.didSchedule.set(true);
    this.setMarkersAndPosition();
  }
}
