import { CurrencyPipe, NgClass, PercentPipe } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Service } from 'src/app/_models/service';
import { ServicesService } from 'src/app/_services/services.service';

@Component({
  selector: 'td[serviceDiscount]',
  template: `
  @if(item().discount > 0) {
    <div class="badge badge-light-success fw-bold">
      {{ item().discount | percent }}
    </div>
  }
  `,
  standalone: true,
  imports: [ NgClass, PercentPipe, ],
})
export class ServiceTableHasAccountCellComponent {
  item = input.required<Service>();
}

@Component({
  selector: 'td[serviceSex]',
  template: `
    <!-- <div class="badge fw-bold"
      [ngClass]="{ 'badge-light-primary': item().sex === 'Masculino', 'badge-light-warning': item().sex === 'Femenino'}">
      {{item().sex}}
    </div> -->
  `,
  standalone: true,
  imports: [ NgClass ],
})
export class ServiceTableSexCellComponent {
  item = input.required<Service>();
}

@Component({
  host: { class: 'd-flex align-items-center' },
  selector: 'td[serviceCell]',
  template: `
    @if (routerLink) {
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
    }
  `,
  standalone: true,
  imports: [RouterModule, CurrencyPipe],
})
export class ServiceTableCellComponent implements OnInit {
  service = inject(ServicesService);

  item = input.required<Service>();

  routerLink?: string;

  ngOnInit(): void {
    this.routerLink = `${
      this.service.naming.catalogRoute
    }/${this.item().id}`;
  }
}
