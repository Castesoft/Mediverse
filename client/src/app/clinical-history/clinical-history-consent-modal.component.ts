import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';

export interface ClinicalHistoryConsentModalData {
  doctorId: number;
  patientId: number;
  currentConsent: boolean;
}

@Component({
  selector: 'div[clinicalHistoryConsentModal]',
  templateUrl: `./clinical-history-consent-modal.component.html`,
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ]
})
export class ClinicalHistoryConsentModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ClinicalHistoryConsentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClinicalHistoryConsentModalData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
