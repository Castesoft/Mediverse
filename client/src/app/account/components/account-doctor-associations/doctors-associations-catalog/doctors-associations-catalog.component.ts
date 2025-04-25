import { Component, inject, model, ModelSignal } from "@angular/core";
import { CatalogMode, View, } from "src/app/_models/base/types";
import { GenericCatalogComponent } from "src/app/_shared/components/catalog-layout.component";
import { ControlsRow3Component } from "src/app/_forms2/builder/controls-row-3.component";
import { ControlsWrapper3Component } from "src/app/_forms2/builder/controls-wrapper-3.component";
import { FormsModule } from "@angular/forms";
import { FilterConfiguration } from "src/app/_models/base/filter-types";
import { DoctorAssociation } from "src/app/_models/doctorAssociations/doctorAssociation";
import { DoctorAssociationParams } from "src/app/_models/doctorAssociations/doctorAssociationParams";
import { DoctorAssociationFiltersForm } from "src/app/_models/doctorAssociations/doctorAssociationFiltersForm";
import {
  DoctorAssociationsService
} from "src/app/account/components/account-doctor-associations/doctor-associations.config";
import {
  DoctorsAssociationsTableComponent
} from "src/app/account/components/account-doctor-associations/doctors-associations-table/doctors-associations-table.component";

@Component({
  selector: '[doctorsAssociationsCatalog]',
  templateUrl: './doctors-associations-catalog.component.html',
  imports: [
    FormsModule,
    DoctorsAssociationsTableComponent,
    ControlsRow3Component,
    ControlsWrapper3Component,
    GenericCatalogComponent,
  ],
})
export class DoctorAssociationsCatalogComponent {
  item: ModelSignal<DoctorAssociation | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<DoctorAssociationParams> = model.required();
  embedded: ModelSignal<boolean> = model(false);
  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration());
  title: ModelSignal<string | undefined> = model();
  useCard: ModelSignal<boolean> = model(false);

  service: DoctorAssociationsService = inject(DoctorAssociationsService);
  form: ModelSignal<DoctorAssociationFiltersForm> = model(new DoctorAssociationFiltersForm());
}
