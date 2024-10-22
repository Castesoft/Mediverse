import { CurrencyPipe, NgClass, PercentPipe } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Prescription } from 'src/app/_models/prescription';
import { PrescriptionsService } from 'src/app/_services/prescriptions.service';

@Component({
  selector: 'td[prescriptionDiscount]',
  template: `
  <!-- @if(item().discount > 0) {
    <div class="badge badge-light-success fw-bold">
      {{ item().discount | percent }}
    </div>
  } -->
  `,
  standalone: true,
  imports: [ NgClass, PercentPipe, ],
})
export class PrescriptionTableHasAccountCellComponent {
  item = input.required<Prescription>();
}

@Component({
  selector: 'td[prescriptionSex]',
  template: `
    <!-- <div class="badge fw-bold"
      [ngClass]="{ 'badge-light-primary': item().sex === 'Masculino', 'badge-light-warning': item().sex === 'Femenino'}">
      {{item().sex}}
    </div> -->
  `,
  standalone: true,
  imports: [ NgClass ],
})
export class PrescriptionTableSexCellComponent {
  item = input.required<Prescription>();
}

@Component({
  host: { class: 'd-flex align-items-center' },
  selector: 'td[prescriptionCell]',
  template: `
    <!-- @if (routerLink) {
    <div class="symbol symbol-circle symbol-50px overflow-hidden me-3">
      <a [routerLink]="[routerLink]">
        <div class="symbol-label">
          @if (item().photoUrl) {
          <img [src]="item().photoUrl" alt="Emma Smith" class="w-100" />
          } @else {
          <div class="symbol-label fs-3 bg-light-danger text-danger">
            {{ item().name[0] }}
          </div>
          }
        </div>
      </a>
    </div>
    <div class="d-flex flex-column">
      <a
        [routerLink]="[routerLink]"
        class="text-gray-800 text-hover-primary mb-1"
        >{{ item().name }}</a
      >
      <span>{{ item().price | currency }}</span>
    </div>
    } -->
  `,
  standalone: true,
  imports: [RouterModule, CurrencyPipe],
})
export class PrescriptionTableCellComponent implements OnInit {
  service = inject(PrescriptionsService);

  item = input.required<Prescription>();

  routerLink?: string;

  ngOnInit(): void {
    this.routerLink = `${
      this.service.dictionary.catalogRoute
    }/${this.item().id}`;
  }
}
