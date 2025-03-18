import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ModalModule } from "ngx-bootstrap/modal";
import { View } from "src/app/_models/base/types";
import { FormUse } from "src/app/_models/forms/formTypes";
import { MedicalLicense } from 'src/app/_models/medicalLicenses/medicalLicense';
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { MedicalLicenseDetailComponent } from 'src/app/account/forms/medical-license-detail.component';

@Component({
  selector: 'medical-license-modal',
  templateUrl: './medical-license-modal.component.html',
  standalone: true,
  imports: [ CommonModule, ModalModule, ModalWrapperModule, MedicalLicenseDetailComponent, CdkModule, MaterialModule, ],
})
export class MedicalLicenseModalComponent {
  data = inject<{
    use: FormUse,
    item: MedicalLicense | null,
    view: View,
  }>(MAT_DIALOG_DATA);
}
