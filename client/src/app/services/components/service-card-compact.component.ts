import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, model } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { View } from "src/app/_models/base/types";
import { Service } from "src/app/_models/services/service";
import { ServicesService } from "src/app/services/services.config";

@Component({
  host: { class: 'card', },
  selector: 'div[serviceCardCompact]',
  template: `
    @if (item) {
      <div class="card-body d-flex flex-center flex-column pt-12 p-9">
        <a [routerLink]="[]" (click)="service.clickLink(this.item, this.key(), 'detail', this.view())"
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
            <div class="fs-6 fw-bold text-gray-700">{{ item.discount! * 100 | number:'1.0-0' }}%</div>
            <div class="fw-semibold text-gray-500">Descuento</div>
          </div>
          <div class="border border-gray-300 border-dashed rounded min-w-80px py-3 px-2 ms-2">
            <div class="fs-6 fw-bold text-gray-700">{{ item.price! * (1 - item.discount!) | currency }}</div>
            <div class="fw-semibold text-gray-500">Subtotal</div>
          </div>
        </div>
      </div>
    }
  `,
  standalone: true,
  imports: [RouterModule, CommonModule,],
})
export class ServiceCardCompactComponent implements OnInit {
  service = inject(ServicesService);
  router = inject(Router);

  view = model.required<View>();
  key = model.required<string>();

  item?: Service;

  ngOnInit(): void {
    // this.service.selected$(this.key()).subscribe({
    //   next: item => {
    //     console.log('ServiceCardCompactComponent.item', item);
    //     this.item = item;
    //   }
    // })

  }
}
