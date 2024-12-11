import { Component } from "@angular/core";
import { Address } from "src/app/_models/addresses/address";
import { AddressFiltersForm } from "src/app/_models/addresses/addressFiltersForm";
import { AddressParams } from "src/app/_models/addresses/addressParams";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import { AddressesService } from "src/app/addresses/addresses.config";

@Component({
  host: { class: 'card card-flush' },
  selector: 'div[homeClinicsCatalogRoute]',
  // selector: 'home-clinics-catalog-route',
  // template: ``,
  templateUrl: './home-clinics-catalog-route.component.html',
  standalone: false,
})
export class HomeClinicsCatalogRouteComponent
  extends BaseRouteCatalog<Address, AddressParams, AddressFiltersForm, AddressesService>
{

  constructor() {
    super(AddressesService, 'clinics');
  }

}
