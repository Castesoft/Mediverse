/// <reference types="@types/google.maps" />
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DoctorSearchResult, DoctorSearchResultParams } from 'src/app/_models/doctorSearchResults';
import { Pagination } from 'src/app/_models/pagination';
import { SearchService } from 'src/app/_services/search.service';
import { TablePagerComponent } from 'src/app/_shared/table/table-pager.component';
import { SearchGeneralComponent } from 'src/app/search/components/search-general/search-general.component';
import { UserProfilePictureComponent } from "../../../users/components/user-profile-picture/user-profile-picture.component";
import { DoctorDetailsComponent } from '../doctor-details/doctor-details.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [TablePagerComponent, SearchGeneralComponent, UserProfilePictureComponent, UserProfilePictureComponent, RouterLink, DoctorDetailsComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  searchService = inject(SearchService);

  params!: DoctorSearchResultParams;
  pagination?: Pagination;
  isLoading = false;

  specialty = '';
  location = '';
  locationName = '';

  selectedDoctor: DoctorSearchResult | null = null;

  map: google.maps.Map | undefined;
  markers: google.maps.marker.AdvancedMarkerElement[] = [];

  async ngOnInit() {
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

    this.specialty = this.route.snapshot.queryParamMap.get('specialty') ?? '';
    this.location = this.route.snapshot.queryParamMap.get('location') ?? '';
    this.locationName = this.route.snapshot.queryParamMap.get('locationName') ?? '';
    this.makeInitialSearch(this.specialty, this.location);
  }

  onPageChanged(page: number) {
    this.isLoading = true;
    this.searchService.searchResultsParams.set({
      ...this.searchService.searchResultsParams(),
      pageNumber: page
    });
    this.searchService.getSearchResults(this.searchService.searchResultsParams()).subscribe({
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

  onSearch(event: {specialty: string, location: string}) {
    const specialty = event.specialty;
    const location = event.location;
    this.makeInitialSearch(specialty, location);
    
  }

  makeInitialSearch(specialty: string, location: string) {
    this.params = new DoctorSearchResultParams(specialty || '', location || '');

    this.searchService.getSearchResults(this.params).subscribe({
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
        });

        this.markers.push(marker);
      }
    }
  }

  resetMarkers() {
    this.markers.forEach((marker) => marker.map = null);
    this.markers = [];
  }

  showDoctorDetails(doctor: DoctorSearchResult) {
    this.selectedDoctor = doctor;
  }

  onCloseDoctorDetails() {
    this.selectedDoctor = null;
  }
}
