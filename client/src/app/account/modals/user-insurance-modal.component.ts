import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ModalModule } from "ngx-bootstrap/modal";
import { View } from "src/app/_models/base/types";
import { FormUse } from "src/app/_models/forms/formTypes";
import { UserMedicalInsuranceCompany } from "src/app/_models/users/userMedicalInsuranceCompany/userMedicalInsuranceCompany";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { UserInsuranceDetailComponent } from "src/app/account/forms/user-insurance-detail.component";

@Component({
  selector: 'user-insurance-modal',
  templateUrl: './user-insurance-modal.component.html',
  standalone: true,
  imports: [ CommonModule, ModalModule, ModalWrapperModule, UserInsuranceDetailComponent, CdkModule, MaterialModule, ],
})
export class UserInsuranceModalComponent {
  data = inject<{
    use: FormUse,
    item: UserMedicalInsuranceCompany | null,
    view: View,
  }>(MAT_DIALOG_DATA);
}
