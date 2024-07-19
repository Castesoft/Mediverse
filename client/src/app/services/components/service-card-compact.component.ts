import {CurrencyPipe, DecimalPipe} from "@angular/common";
import {Component, inject, input, OnInit} from "@angular/core";
import {Router, RouterLink} from "@angular/router";
import {Role, View} from "src/app/_models/types";
import {Service} from "src/app/_models/service";
import {ServicesService} from "src/app/_services/services.service";

@Component({
  host: { class: 'card', },
  selector: 'div[serviceCardCompact]',
  template: `
    @if (item) {
      <div class="card-body d-flex flex-center flex-column pt-12 p-9">
        <!--        <div class="symbol symbol-65px symbol-circle mb-5">-->
        <!--          @if (item.photoUrl) {-->
        <!--            <img [src]="item.photoUrl" [alt]="item.name" class="w-100"/>-->
        <!--          } @else {-->
        <!--            <span class="symbol-label fs-2x fw-semibold text-primary bg-light-primary">-->
        <!--                {{ item.name[0] }}-->
        <!--            </span>-->
        <!--          }-->
        <!--          <div-->
        <!--            class="bg-success position-absolute border border-4 border-body h-15px w-15px rounded-circle translate-middle start-100 top-100 ms-n3 mt-n3">-->
        <!--          </div>-->
        <!--        </div>-->
        <a [routerLink]="[]" (click)="service.clickLink(item.id, item, key(), 'detail', view())"
           class="fs-4 text-gray-800 text-hover-primary fw-bold mb-0">
          {{ item.name }}
        </a>
        <div class="fw-semibold text-gray-500 mb-6">{{ item.description }}</div>
        <div class="d-flex flex-grow-1 justify-content-between w-100">
          <div class="border border-gray-300 border-dashed rounded min-w-80px py-3 px-2 me-2">
            <div class="fs-6 fw-bold text-gray-700">{{ item.price | currency }}</div>
            <div class="fw-semibold text-gray-500">Por pagar</div>
          </div>
          <div class="border border-gray-300 border-dashed rounded min-w-80px py-3 px-2 mx-2">
            <div class="fs-6 fw-bold text-gray-700">{{ item.discount * 100 | number:'1.0-0' }}%</div>
            <div class="fw-semibold text-gray-500">Descuento</div>
          </div>
          <div class="border border-gray-300 border-dashed rounded min-w-80px py-3 px-2 ms-2">
            <div class="fs-6 fw-bold text-gray-700">{{ item.price * (1 - item.discount) | currency }}</div>
            <div class="fw-semibold text-gray-500">Subtotal</div>
          </div>
        </div>
      </div>
    }
  `,
  standalone: true,
  imports: [DecimalPipe, CurrencyPipe, RouterLink,],
})
export class ServiceCardCompactComponent implements OnInit {
  service = inject(ServicesService);
  router = inject(Router);

  view = input.required<View>();
  key = input.required<string>();

  item?: Service;

  ngOnInit(): void {
    this.service.selected$(this.key()).subscribe({
      next: item => {
        console.log('ServiceCardCompactComponent.item', item);
        this.item = item;
      }
    })

  }
}
