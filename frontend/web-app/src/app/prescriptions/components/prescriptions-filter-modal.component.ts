import { Component, Input } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Sex } from "../../_models/user";
import { BsModalRef } from "ngx-bootstrap/modal";
import { IconsService } from "../../_services/icons.service";
import { PrescriptionsService } from "../../_services/data/prescriptions.service";
import { PrescriptionsFilterFormComponent } from "./prescriptions-filter-form.component";

@Component({
  selector: 'prescriptions-filter-modal',
  templateUrl: './prescriptions-filter-modal.component.html',
  standalone: true,
  imports: [ PrescriptionsFilterFormComponent, FontAwesomeModule, ],
})
export class PrescriptionsFilterModalComponent {
  formId?: string;

  constructor(
    public modal: BsModalRef,
    public icons: IconsService,
    public service: PrescriptionsService,
  ) {}

  get visible(): boolean {
    return (this.formId !== undefined);
  }

}
