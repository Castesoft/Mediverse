import { Component, inject, model, ModelSignal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "src/app/_shared/material.module";
import { CdkModule } from "src/app/_shared/cdk.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IModal } from "src/app/_models/modal";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconsService } from "src/app/_services/icons.service";

@Component({
  selector: "confirm-modal",
  templateUrl: "./confirm.component.html",
  imports: [
    CommonModule,
    MaterialModule,
    CdkModule,
    FormsModule,
    ReactiveFormsModule,
    FaIconComponent,
  ],
})
export class ConfirmComponent {
  readonly dialogRef: MatDialogRef<any, any> = inject(MatDialogRef<ConfirmComponent>);
  readonly data: IModal = inject<IModal>(MAT_DIALOG_DATA);
  readonly result: ModelSignal<boolean | null> = model(this.data.result);
  readonly iconsService: IconsService = inject(IconsService);

  btnColorClass: string = "";

  constructor() {
    this.btnColorClass = this.data.btnColor ? `btn-${this.data.btnColor}` : "btn-primary";
  }

  onCancel(): void {
    this.result.set(false);
    this.dialogRef.close(this.result());
  }

  onConfirm(): void {
    this.result.set(true);
    this.dialogRef.close(this.result());
  }
}
