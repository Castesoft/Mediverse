import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import Event from "src/app/_models/events/event";

@Component({
  selector: 'appointment-summary',
  template: `
  <!-- <div class="d-flex flex-stack mb-6">
  <div class="d-flex align-items-center me-2">
    <div class="symbol symbol-45px me-5">
      <span class="symbol-label bg-light-danger">
        <img
          [src]="item.patient.photoUrl"
          class="h-100 align-self-center"
          alt=""
          [style]="{ borderRadius: '0.475rem' }"
        />
      </span>
    </div>
    <div>
      <a href="#" class="fs-5 text-gray-800 text-hover-primary fw-bolder">{{
        item.patient.firstName
      }}</a>
      <div class="fs-7 text-gray-500 fw-semibold mt-1">
        {{ item.time | date : "medium" }}
      </div>
    </div>
  </div>
  <a
    href="#"
    class="btn btn-icon btn-light btn-sm"
    [routerLink]="['appointments', item.id]"
  >
    <i class="ki-duotone ki-arrow-right fs-4 text-gray-500">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>
  </a>
</div> -->
  `,
  standalone: true,
  imports: [ RouterModule, DatePipe, ]
})
export class EventSummaryComponent {
  @Input({ required: true }) item!: Event;
}
