import { Component, Input } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Sex } from "../../_models/user";
import { BsModalRef } from "ngx-bootstrap/modal";
import { IconsService } from "../../_services/icons.service";
import { PatientsService } from "../../_services/data/patients.service";
import { PatientsFilterFormComponent } from "./patients-filter-form.component";

@Component({
  selector: 'patients-filter-modal',
  templateUrl: './patients-filter-modal.component.html',
  standalone: true,
  imports: [ PatientsFilterFormComponent, FontAwesomeModule, ],
})
export class PatientsFilterModalComponent {
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
