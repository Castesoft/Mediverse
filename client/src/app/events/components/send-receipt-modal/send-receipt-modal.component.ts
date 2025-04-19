import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SendReceiptModalData, SendReceiptModalResult } from './sendReceiptModalData';
import { InputControlComponent } from 'src/app/_forms/input-control.component';

@Component({
  selector: 'app-send-receipt-modal',
  templateUrl: './send-receipt-modal.component.html',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    InputControlComponent,
  ],
})
export class SendReceiptModalComponent implements OnInit {
  readonly dialogRef: MatDialogRef<any, any> = inject(MatDialogRef<SendReceiptModalComponent, SendReceiptModalResult>);
  readonly data: SendReceiptModalData = inject(MAT_DIALOG_DATA);

  emailControl: FormControl<string | null> = new FormControl('', [ Validators.required, Validators.email ]);

  ngOnInit(): void {
    this.emailControl.setValue(this.data.patientEmail || '');
  }

  isFormValid(): boolean {
    return this.emailControl.valid;
  }
}
