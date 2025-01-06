import { Component } from "@angular/core";
import BaseRouteCatalog from "src/app/_models/base/components/extensions/routes/baseRouteCatalog";
import Nurse from "src/app/_models/nurses/nurse";
import { NurseFiltersForm } from "src/app/_models/nurses/nurseFiltersForm";
import { NurseParams } from "src/app/_models/nurses/nurseParams";
import { NursesService } from "src/app/nurses/nurses.config";

@Component({
  host: { class: 'card card-flush' },
  selector: 'div[homeNursesCatalogRoute]',
  // selector: 'home-nurses-catalog-route',
  templateUrl: './home-nurses-catalog-route.component.html',
  standalone: false,
})
export class HomeNursesCatalogRouteComponent
  extends BaseRouteCatalog<Nurse, NurseParams, NurseFiltersForm, NursesService>
{

  constructor() {
    super(NursesService, 'nurses');
  }

}
