import { CommonModule } from "@angular/common";
import { Component, inject, model } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IModal } from "src/app/_models/modal";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";

@Component({
  selector: "confirm-modal",
  template: `
      <h2 mat-dialog-title>{{ data.title }}
          <!-- <code>{{result() | json}}</code> -->
      </h2>
      <mat-dialog-content>
          <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions>
          <button mat-button (click)="onCancel()">{{ data.btnCancelText }}</button>
          <button mat-button (click)="onConfirm()" cdkFocusInitial>{{ data.btnOkText }}</button>
      </mat-dialog-actions>
  `,
  standalone: true,
  imports: [ CommonModule, MaterialModule, CdkModule, FormsModule, ReactiveFormsModule, ],
})
export class ConfirmComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmComponent>);
  readonly data = inject<IModal>(MAT_DIALOG_DATA);
  readonly result = model(this.data.result);

  onCancel(): void {
    this.result.set(false);
    this.dialogRef.close(this.result());
  }

  onConfirm(): void {
    this.result.set(true);
    this.dialogRef.close(this.result());
  }
}
