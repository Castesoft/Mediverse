import { CurrencyPipe, NgClass, PercentPipe } from '@angular/common';
import { Component, inject, input, model, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from 'src/app/_models/product';
import { ProductsService } from 'src/app/_services/products.service';

@Component({
  selector: 'td[productDiscount]',
  template: `
  @if(item().discount! > 0) {
    <div class="badge badge-light-success fw-bold">
      {{ item().discount | percent }}
    </div>
  }
  `,
  standalone: true,
  imports: [ NgClass, PercentPipe, ],
})
export class ProductTableHasAccountCellComponent {
  item = model.required<Product>();
}

@Component({
  selector: 'td[productSex]',
  template: `
    <!-- <div class="badge fw-bold"
      [ngClass]="{ 'badge-light-primary': item().sex === 'Masculino', 'badge-light-warning': item().sex === 'Femenino'}">
      {{item().sex}}
    </div> -->
  `,
  standalone: true,
  imports: [ NgClass ],
})
export class ProductTableSexCellComponent {
  item = model.required<Product>();
}

@Component({
  host: { class: 'd-flex align-items-center' },
  selector: 'td[productCell]',
  template: `
    @if (routerLink) {
    <div class="symbol symbol-circle symbol-50px overflow-hidden me-3">
      <a [routerLink]="[routerLink]">
        <div class="symbol-label">
          @if (item().photoUrl) {
          <img [src]="item().photoUrl" alt="Emma Smith" class="w-100" />
          } @else {
          <div class="symbol-label fs-3 bg-light-danger text-danger">
            {{ item().name![0] }}
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
export class ProductTableCellComponent implements OnInit {
  service = inject(ProductsService);

  item = model.required<Product>();

  routerLink?: string;

  ngOnInit(): void {
    this.routerLink = `${
      this.service.dictionary.catalogRoute
    }/${this.item().id}`;
  }
}
