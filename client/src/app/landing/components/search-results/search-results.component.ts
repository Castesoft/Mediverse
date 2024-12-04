/// <reference types="@types/google.maps" />
import { Component, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SearchResults } from 'src/app/_models/doctorSearchResults';
import { SearchService } from 'src/app/_services/search.service';
import { TablePagerComponent } from 'src/app/_shared/table/table-pager.component';
import { CommonModule } from '@angular/common';
import { AccountService } from 'src/app/_services/account.service';
import { UserDropdownComponent } from 'src/app/_shared/layout/user-dropdown.component';
import { BsDropdownDirective, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Search } from 'src/app/_models/search';
import { UserProfilePictureComponent } from 'src/app/users/components/user-profile-picture/user-profile-picture.component';
import { SearchFormComponent } from 'src/app/search/components/search-form.component';
import { DoctorResult } from 'src/app/_models/doctorResult';
import { SearchAuthComponent } from 'src/app/search/components/search-auth.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { DoctorDetailWindowComponent } from 'src/app/search/windows/doctor-detail-window.component';
import { DoctorScheduleWindowComponent } from 'src/app/search/windows/doctor-schedule-window.component';
import { AvailableDay } from 'src/app/_models/availableDay';
import { DoctorResultsWindowComponent } from 'src/app/search/windows/doctor-results-window.component';
import { Theme, ThemeService } from 'src/app/_services/theme.service';

@Component({
  selector: 'div[searchResults]',
  host: { class: 'h-100 d-flex mobile-view', },
  standalone: true,
  imports: [TablePagerComponent, SearchFormComponent, UserProfilePictureComponent, CommonModule, RouterModule, UserDropdownComponent, BsDropdownModule,
    SearchAuthComponent, DoctorDetailWindowComponent, DoctorScheduleWindowComponent, DoctorResultsWindowComponent,
  ],
  providers: [ BsDropdownDirective, ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  service = inject(SearchService);
  accountService = inject(AccountService);
  theme = inject(ThemeService);

  destroyed = new Subject<void>();
  isMobile = signal(false);
  showMobileSearch = signal(false);
  didSchedule = signal(false);
  scheduleWindowOpen = signal(false);
  selectedSchedule = signal<AvailableDay | null>(null);

  startingTab = 'general';

  map?: google.maps.Map;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile.set(event.target.innerWidth <= 768);
  }

  mapOptions: google.maps.MapOptions = {
    colorScheme: 'FOLLOW_SYSTEM',
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    mapId: "49526df74cd05e3a",
  } as google.maps.MapOptions;

  constructor() {
    inject(BreakpointObserver)
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        if (result.matches) {
          this.isMobile.set(result.breakpoints[Breakpoints.XSmall] || result.breakpoints[Breakpoints.Small]);
        }
      })

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

    this.isMobile.set(window.innerWidth <= 768);

    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    this.map = new Map(document.getElementById("map") as HTMLElement, {
      center: { lat: 22.5799, lng: -103.1648 },
      zoom: 6,
      ...this.mapOptions,
      colorScheme: this.getTheme(this.theme.theme()),
    } as google.maps.MapOptions);

    if (this.isMobile() && (this.service.search().location || this.service.search().specialty)) {
      this.showMobileSearch.set(true);
    }
  }

  setMarkersAndPosition() {
    this.service.resetMarkers();
    const results: SearchResults | null = this.service.results();
    const selected: DoctorResult | null = this.service.selected();
    if (results) {
      if (results.latitude !== null && results.longitude !== null) {
        this.map?.setCenter({ lat: results.latitude, lng: results.longitude });
        this.map?.setZoom(12);
      } else {
        this.map?.setCenter({ lat: 22.5799, lng: -103.1648 });
        this.map?.setZoom(6);
      }
      if (results.doctors.length > 0) {
        if (selected && this.didSchedule()) {
          this.service.close();
          this.startingTab = 'schedule';
          setTimeout(() => {
            this.service.open(selected);
          }, 10);
          setTimeout(() => {
            this.startingTab = 'general';
          }, 100);
        }
        for (const doctor of results.doctors) {
          this.showMarker(doctor);
        }
      }
    }
  }

  onSearchChange(event: Search) {
    this.service.search.set(new Search({ ...event }));

    this.service.resetMarkers();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.service.search().params,
      queryParamsHandling: 'merge'
    });

    if (this.isMobile()) {
      this.showMobileSearch.set(true);
    }

    this.setMarkersAndPosition();
  }

  async showMarker(doctor: DoctorResult) {
    if (this.map) {
      const {AdvancedMarkerElement} = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      for (const address of doctor.addresses) {
        const marker = new AdvancedMarkerElement({
          position: { lat: address.latitude!, lng: address.longitude! },
          map: this.map,
          title: `${doctor.firstName} ${doctor.lastName}`
        });

        marker.addListener("click", () => {
          this.service.open(doctor);
          this.service.hoveredMarker.set(null);
          if (this.isMobile() && this.service.selected()) {
            this.showMobileSearch.set(true);
          }
        });

        marker.content?.addEventListener("mouseenter", () => {
          this.service.hoveredMarker.set(doctor);
        });

        marker.content?.addEventListener("mouseleave", () => {
          this.service.hoveredMarker.set(null);
        });

        this.service.markers.set([...this.service.markers(), marker]);
        const doctorMarkers = this.service.markersMap().get(doctor);
        if (doctorMarkers) {
          doctorMarkers.push(marker);
        } else {
          this.service.setMarkerToMap(doctor, marker);
        }
      }
    }
  }

  // centerMapOnDoctor(doctor: DoctorResult) {
  //   const address = doctor.addresses[0];
  //   this.map?.setCenter({ lat: address.latitude!, lng: address.longitude! });
  //   this.map?.setZoom(12);
  // }

  onEventCreated() {
    this.didSchedule.set(true);
    this.setMarkersAndPosition();
  }
}
