import { Component } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { PrescriptionsService } from "../../data/prescriptions.service";
import { IconsService } from "../../icons.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { PrescriptionsCatalogComponent } from "../../../prescriptions/prescriptions-catalog.component";
import { Sex } from "../../../_models/types";

export const ANIMAL_SELECT_MODAL_ID = 'prescription-select-modal';

@Component({
  selector: 'prescription-select-modal',
  templateUrl: './prescription-select-modal.component.html',
  standalone: true,
  imports: [ FontAwesomeModule, PrescriptionsCatalogComponent,  ],
})
export class PrescriptionSelectModalComponent {
  sex: Sex = 'prescription';
  catalogId?: string;

  constructor(
    public modal: BsModalRef,
    public icons: IconsService,
    public service: PrescriptionsService,
  ) {}

  get visible(): boolean {
    return (this.sex !== undefined) && (this.catalogId !== undefined);
  }

}
