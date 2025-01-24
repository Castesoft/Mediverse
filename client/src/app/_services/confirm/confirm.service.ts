import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { Modal, IModal } from 'src/app/_models/modal';
import { ConfirmComponent } from 'src/app/_services/confirm/confirm.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private readonly matDialog: MatDialog = inject(MatDialog);

  result: WritableSignal<boolean | null> = signal<boolean | null>(null);

  confirm(modal: Modal): Observable<boolean> {
    const dialogRef: MatDialogRef<ConfirmComponent> = this.matDialog.open<ConfirmComponent, IModal>(ConfirmComponent, {
      data: {
        btnCancelText: modal.btnCancelText,
        btnOkText: modal.btnOkText,
        message: modal.message,
        title: modal.title,
        result: this.result(),
      } as IModal,
    });

    return dialogRef.afterClosed().pipe(map(result => result))
  }
}
