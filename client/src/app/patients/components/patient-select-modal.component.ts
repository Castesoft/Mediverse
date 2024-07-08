import { Component } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { IconsService } from "../../_services/icons.service";
import { PatientsCatalogComponent } from "./patients-catalog.component";
import { PatientsService } from "../../_services/data/patients.service";

export const ANIMAL_SELECT_MODAL_ID = 'patient-select-modal';

@Component({
  selector: 'patient-select-modal',
  templateUrl: './patient-select-modal.component.html',
  standalone: true,
  imports: [ FontAwesomeModule, PatientsCatalogComponent,  ],
})
export class PatientSelectModalComponent {
  formId?: string;

  constructor(
    public modal: BsModalRef,
    public icons: IconsService,
    public service: PatientsService,
  ) {}

  get visible(): boolean {
    return (this.formId !== undefined);
  }

}
