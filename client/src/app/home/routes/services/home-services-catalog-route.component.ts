import { Component } from "@angular/core";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import { Service } from "src/app/_models/services/service";
import { ServiceFiltersForm } from "src/app/_models/services/serviceFiltersForm";
import { ServiceParams } from "src/app/_models/services/serviceParams";
import { ServicesService } from "src/app/services/services.config";

@Component({
  selector: 'div[homeServicesCatalogRoute]',
  templateUrl: './home-services-catalog-route.component.html',
  standalone: false,
})
export class HomeServicesCatalogRouteComponent extends BaseRouteCatalog<Service, ServiceParams, ServiceFiltersForm, ServicesService> {
  constructor() {
    super(ServicesService, 'services');
  }
}
