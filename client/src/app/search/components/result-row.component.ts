import { CommonModule } from "@angular/common";
import { Component, HostListener, inject, model, ModelSignal } from "@angular/core";
import { DoctorResult } from "src/app/_models/doctors/doctorResults/doctorResult";
import { SearchService } from "src/app/_services/search.service";
import { ProfilePictureComponent } from "src/app/users/components/profile-picture/profile-picture.component";
import { PhotoSize } from "src/app/_models/photos/photoTypes";

@Component({
  selector: 'div[resultRow]',
  templateUrl: './result-row.component.html',
  styleUrl: './result-row.component.scss',
  imports: [ CommonModule, ProfilePictureComponent, ],
})
export class ResultRowComponent {
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;

  service: SearchService = inject(SearchService);
  doctor: ModelSignal<DoctorResult> = model.required<DoctorResult>();

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
