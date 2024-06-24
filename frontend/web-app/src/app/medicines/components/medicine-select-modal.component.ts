import { Component } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MedicinesCatalogComponent } from "./medicines-catalog.component";
import { IconsService } from "../../_services/icons.service";
import { MedicinesService } from "../../_services/data/medicines.service";
import { CatalogMode } from "../../_models/types";

export const ANIMAL_SELECT_MODAL_ID = 'medicine-select-modal';

@Component({
  selector: 'medicine-select-modal',
  templateUrl: './medicine-select-modal.component.html',
  standalone: true,
  imports: [ FontAwesomeModule, MedicinesCatalogComponent,  ],
})
export class MedicineSelectModalComponent {
  catalogId?: string;
  mode: CatalogMode = "select";
  formId?: string;

  constructor(
    public modal: BsModalRef,
    public icons: IconsService,
    public service: MedicinesService,
  ) {}

  get visible(): boolean {
    return (this.catalogId !== undefined);
  }

}
