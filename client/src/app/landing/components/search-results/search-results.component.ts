/// <reference types="@types/google.maps" />
import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DoctorSearchResult } from 'src/app/_models/doctorSearchResults';
import { Pagination } from 'src/app/_models/pagination';
import { SearchService } from 'src/app/_services/search.service';
import { TablePagerComponent } from 'src/app/_shared/table/table-pager.component';
import { SearchGeneralComponent } from 'src/app/search/components/search-general/search-general.component';
import { DoctorDetailsComponent } from '../doctor-details/doctor-details.component';
import { UtilsService } from 'src/app/_services/utils.service';
import { CommonModule } from '@angular/common';
import { AccountService } from 'src/app/_services/account.service';
import { UserDropdownComponent } from 'src/app/_shared/layout/user-dropdown.component';
import { BsDropdownDirective, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Search } from 'src/app/_models/search';
import { UserProfilePictureComponent } from 'src/app/users/components/user-profile-picture/user-profile-picture.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [TablePagerComponent, SearchGeneralComponent, UserProfilePictureComponent, DoctorDetailsComponent, CommonModule, RouterModule, UserDropdownComponent, BsDropdownModule],
  providers: [ BsDropdownDirective, ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private utilsService = inject(UtilsService);
  service = inject(SearchService);
  accountService = inject(AccountService);

  pagination?: Pagination;
  isLoading = false;
  isMobile = signal(false);
  showMobileSearch = signal(false);
  didSchedule = signal(false);

  selectedDoctor = signal<DoctorSearchResult | null>(null);
  startingTab = 'general';

  map: google.maps.Map | undefined;
  markers: google.maps.marker.AdvancedMarkerElement[] = [];
  doctorMarkersMap = new Map<DoctorSearchResult, google.maps.marker.AdvancedMarkerElement[]>();
  hoveredMarkerDoctor: DoctorSearchResult | null = null;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile.set(event.target.innerWidth <= 768);
  }

  async ngOnInit() {
    this.isMobile.set(window.innerWidth <= 768);

    this.isLoading = true;
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    this.map = new Map(document.getElementById("map") as HTMLElement, {
      center: { lat: 22.5799, lng: -103.1648 },
      zoom: 6,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      mapId: "8aab1a49ed502607"
    });

    this.service.search.set(this.service.search().setFromQueryParamMap(this.route.snapshot.queryParamMap));
    this.makeInitialSearch();

    console.log(this.service.search());


    if (this.isMobile() && (this.service.search().location || this.service.search().specialty)) {
      this.showMobileSearch.set(true);
    }
  }

  onPageChanged(page: number) {
    this.isLoading = true;
    this.service.search.set(new Search({
      ...this.service.search(),
      pageNumber: page,
    }));

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { pageNumber: page },
      queryParamsHandling: 'merge'
    });

    this.service.getSearchResults().subscribe({
      next: (response) => {
        const { result, pagination } = response;
        this.resetMarkers();
        if (result) {
          for (const doctor of result.doctors) {
            this.showMarker(doctor);
          }
        }
        this.pagination = pagination;
        this.isLoading = false;
      }
    });
  }

  onSearchChange(event: Search) {
    this.service.search.set(new Search({ ...event }));

    this.resetMarkers();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.service.search().params,
      queryParamsHandling: 'merge'
    });

    if (this.isMobile()) {
      this.showMobileSearch.set(true);
    }

    this.makeInitialSearch();
  }

  makeInitialSearch() {
    console.log(this);

    this.service.getSearchResults({ignoreCache: true}).subscribe({
      next: (response) => {
        const { result, pagination } = response;
        if (result) {
          if (result.latitude && result.longitude) {
            this.map?.setCenter({ lat: result.latitude, lng: result.longitude });
            this.map?.setZoom(12);
          } else {
            this.map?.setCenter({ lat: 22.5799, lng: -103.1648 });
            this.map?.setZoom(6);
          }
          if (result.doctors.length > 0) {
            if (this.selectedDoctor && this.didSchedule()) {
              const selectedDoctor = result.doctors.find(d => d.id === this.selectedDoctor()?.id);
              if (selectedDoctor) {
                this.onCloseDoctorDetails();
                this.startingTab = 'schedule';
                setTimeout(() => {
                  this.showDoctorDetails(selectedDoctor);
                }, 10);
                setTimeout(() => {
                  this.startingTab = 'general';
                }, 100);
              }
              this.didSchedule.set(false);
            }

            for (const doctor of result.doctors) {
              this.showMarker(doctor);
            }
          } else {
            this.resetMarkers();
          }

        }
        this.pagination = pagination;
        this.isLoading = false;
      },
    });
  }

  async showMarker(doctor: DoctorSearchResult) {
    if (this.map) {
      const {AdvancedMarkerElement} = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      for (const address of doctor.addresses) {
        const marker = new AdvancedMarkerElement({
          position: { lat: address.latitude!, lng: address.longitude! },
          map: this.map,
          title: `${doctor.firstName} ${doctor.lastName}`
        });

        marker.addListener("click", () => {
          this.showDoctorDetails(doctor);
          this.hoveredMarkerDoctor = null;
          if (this.isMobile() && this.selectedDoctor()) {
            this.showMobileSearch.set(true);
          }
        });

        marker.content?.addEventListener("mouseenter", () => {
          this.hoveredMarkerDoctor = doctor;
        });

        marker.content?.addEventListener("mouseleave", () => {
          this.hoveredMarkerDoctor = null;
        });

        this.markers.push(marker);
        const doctorMarkers = this.doctorMarkersMap.get(doctor);
        if (doctorMarkers) {
          doctorMarkers.push(marker);
        } else {
          this.doctorMarkersMap.set(doctor, [marker]);
        }
      }
    }
  }

  resetMarkers() {
    this.markers.forEach((marker) => marker.map = null);
    this.markers = [];
  }

  showDoctorDetails(doctor: DoctorSearchResult) {
    this.selectedDoctor.set(doctor);
    this.doctorMarkersMap.forEach((_, doctor) => {
      this.resetDoctorMarkersIcons(doctor);
    });
    this.transformDoctorMarkersIcons(doctor);
  }

  showDoctorOnMap(doctor: DoctorSearchResult) {
    this.selectedDoctor.set(doctor);
    this.doctorMarkersMap.forEach((_, doctor) => {
      this.resetDoctorMarkersIcons(doctor);
    });
    this.transformDoctorMarkersIcons(doctor);
    this.centerMapOnDoctor(doctor);
    this.showMobileSearch.set(false);
  }

  centerMapOnDoctor(doctor: DoctorSearchResult) {
    const address = doctor.addresses[0];
    this.map?.setCenter({ lat: address.latitude!, lng: address.longitude! });
    this.map?.setZoom(12);
  }

  onCloseDoctorDetails() {
    this.selectedDoctor.set(null);
    this.doctorMarkersMap.forEach((_, doctor) => {
      this.resetDoctorMarkersIcons(doctor);
    });
  }

  onDoctorHover(doctor: DoctorSearchResult) {
    this.transformDoctorMarkersIcons(doctor);
  }

  onDoctorLeave(doctor: DoctorSearchResult) {
    if (this.selectedDoctor() === doctor) return;

    this.resetDoctorMarkersIcons(doctor);
  }

  transformDoctorMarkersIcons(doctor: DoctorSearchResult) {
    const doctorMarkers = this.doctorMarkersMap.get(doctor);
    if (doctorMarkers) {
      doctorMarkers.forEach((marker) => {
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
        marker.content = fragment;
        marker.zIndex = doctor === this.selectedDoctor() ? 101 : 100;
      });
    }
  }

  resetDoctorMarkersIcons(doctor: DoctorSearchResult) {
    const doctorMarkers = this.doctorMarkersMap.get(doctor);
    if (doctorMarkers) {
      doctorMarkers.forEach((marker) => {
        marker.content = null;
        marker.zIndex = 0;
      });
    }
  }

  onEventCreated() {
    this.didSchedule.set(true);
    this.makeInitialSearch();
  }
}
