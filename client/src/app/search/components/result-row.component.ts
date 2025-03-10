import { CommonModule } from "@angular/common";
import { Component, HostListener, inject, model, ModelSignal } from "@angular/core";
import { DoctorResult } from "src/app/_models/doctors/doctorResults/doctorResult";
import { SearchService } from "src/app/_services/search.service";
import { PhotoSize } from "src/app/_models/photos/photoTypes";
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'div[resultRow]',
  templateUrl: './result-row.component.html',
  styleUrl: './result-row.component.scss',
  imports: [ CommonModule, ],
})
export class ResultRowComponent {
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;

  readonly service: SearchService = inject(SearchService);
  readonly utilsService: UtilsService = inject(UtilsService);
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
