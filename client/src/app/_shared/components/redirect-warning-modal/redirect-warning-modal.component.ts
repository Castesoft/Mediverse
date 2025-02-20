import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from "src/app/_shared/material.module";
import { RedirectWarningData } from "src/app/_shared/components/redirect-warning-modal/redirectWarningData";

@Component({
  selector: 'app-redirect-warning-modal',
  templateUrl: "redirect-warning-modal.component.html",
  styleUrl: "redirect-warning-modal.component.scss",
  imports: [ MaterialModule ],
})
export class RedirectWarningModalComponent {
  readonly dialogRef: MatDialogRef<RedirectWarningModalComponent> = inject(MatDialogRef);
  readonly data: RedirectWarningData = inject(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
