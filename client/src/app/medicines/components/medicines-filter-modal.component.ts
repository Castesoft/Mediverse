import { Component, Input } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Sex } from "../../_models/user";
import { BsModalRef } from "ngx-bootstrap/modal";
import { IconsService } from "../../_services/icons.service";
import { MedicinesService } from "../../_services/data/medicines.service";
import { MedicinesFilterFormComponent } from "./medicines-filter-form.component";

@Component({
  selector: 'medicines-filter-modal',
  templateUrl: './medicines-filter-modal.component.html',
  standalone: true,
  imports: [ MedicinesFilterFormComponent, FontAwesomeModule, ],
})
export class MedicinesFilterModalComponent {
  formId?: string;

  constructor(
    public modal: BsModalRef,
    public icons: IconsService,
    public service: MedicinesService,
  ) {}

  get visible(): boolean {
    return (this.formId !== undefined);
  }

}
