import { Component, inject, input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Address } from 'src/app/_models/addresses/address';
import { Addresses } from "src/app/_models/addresses/addressTypes";
import { AddressesService } from "src/app/addresses/addresses.config";

@Component({
  host: { class: 'd-flex align-items-center' },
  selector: 'td[addressCell]',
  template: `
    @if (routerLink) {
    <div class="symbol symbol-circle symbol-50px overflow-hidden me-3">
      <a [routerLink]="[routerLink]">
        <div class="symbol-label">
          @if (address().photoUrl) {
          <img [src]="address().photoUrl" alt="Emma Smith" class="w-100" />
          } @else {
          <div class="symbol-label fs-3 bg-light-danger text-danger">
            {{ address()?.name[0] }}
          </div>
          }
        </div>
      </a>
    </div>
    <div class="d-flex flex-column">
      <a
        [routerLink]="[routerLink]"
        class="text-gray-800 text-hover-primary mb-1"
        >{{ address().name }}</a
      >
      <span>{{ address().city }}</span>
    </div>
    }
  `,
  standalone: true,
  imports: [RouterModule],
})
export class AddressTableCellComponent implements OnInit {
  service = inject(AddressesService);

  address = input.required<Address>();
  type = input.required<Addresses>();

  routerLink?: string;

  ngOnInit(): void {
    // this.routerLink = `${
    //   this.service.namingDictionary.get(this.type())!.catalogRoute
    // }/${this.address().id}`;
  }
}
