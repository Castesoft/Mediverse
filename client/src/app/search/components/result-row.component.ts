import { CommonModule } from "@angular/common";
import { Component, HostListener, inject, model } from "@angular/core";
import { DoctorResult } from "src/app/_models/doctorResult";
import { SearchService } from "src/app/_services/search.service";
import { UserProfilePictureComponent } from "src/app/users/components/user-profile-picture/user-profile-picture.component";

/*

<div [class.hovered]="hoveredMarkerDoctor === doctor" (click)="showDoctorDetails(doctor)"
  (mouseenter)="onDoctorHover(doctor)" (mouseleave)="onDoctorLeave(doctor)">

*/

@Component({
  host: { class: 'd-flex flex-column p-6 doctor-search-result', },
  selector: 'div[resultRow]',
  templateUrl: './result-row.component.html',
  standalone: true,
  imports: [CommonModule, UserProfilePictureComponent,],
})
export class ResultRowComponent {
  service = inject(SearchService);

  doctor = model.required<DoctorResult>();

  @HostListener('click')
  onClick() {
    this.service.open(this.doctor());
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.service.onHover(this.doctor());
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.service.onLeave(this.doctor());
  }

}
