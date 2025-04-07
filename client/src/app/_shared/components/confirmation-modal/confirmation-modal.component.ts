import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  imports: [ CommonModule, MaterialModule ],
})
export class ConfirmationModalComponent {
  private readonly dialogRef: MatDialogRef<ConfirmationDialogData> = inject(MatDialogRef);

  readonly data: ConfirmationDialogData = inject(MAT_DIALOG_DATA);

  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
  confirmButtonColor: 'primary' | 'accent' | 'warn';

  constructor() {
    this.title = this.data.title;
    this.message = this.data.message;
    this.confirmButtonText = this.data.confirmButtonText || 'Confirmar';
    this.cancelButtonText = this.data.cancelButtonText || 'Cancelar';
    this.confirmButtonColor = this.data.confirmButtonColor || 'warn';
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
