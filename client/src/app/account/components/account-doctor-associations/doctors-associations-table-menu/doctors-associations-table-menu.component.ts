import { Component, input, InputSignal, model, ModelSignal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";
import { DoctorAssociation } from "src/app/_models/doctorAssociations/doctorAssociation";
import {
  DoctorAssociationsService
} from "src/app/account/components/account-doctor-associations/doctor-associations.config";

@Component({
  selector: 'div[doctorsAssociationsTableMenu]',
  templateUrl: './doctors-associations-table-menu.component.html',
  standalone: true,
  imports: [ RouterModule, CdkModule, MaterialModule ],
})
export class DoctorsAssociationsTableMenuComponent extends TableMenuComponent<DoctorAssociation, any, any, DoctorAssociationsService> {
  override item: ModelSignal<DoctorAssociation> = model.required();
  override key: InputSignal<string> = input.required();

  constructor() {
    super();
  }

  removeAssociation(): void {
    const item = this.item();
    if (!item) return;
    this.service().removeAssociation(item.doctorId, item.nurseId).then(() => {
      console.log("Association removed successfully");
    }).catch(err => console.error("Error removing association:", err));
  }
}
