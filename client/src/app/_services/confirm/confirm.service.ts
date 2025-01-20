import { inject, Injectable, signal } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { Modal, IModal } from 'src/app/_models/modal';
import { ConfirmComponent } from 'src/app/_services/confirm/confirm.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private readonly matDialog = inject(MatDialog);

  result = signal<boolean | null>(null);

  constructor() {

  }

  confirm(modal?: Modal, config?: MatDialogConfig): Observable<boolean> {
    const dialogRef = this.matDialog.open<ConfirmComponent, IModal>(ConfirmComponent, {
      data: {
        btnCancelText: modal!.btnCancelText,
        btnOkText: modal!.btnOkText,
        message: modal!.message,
        title: modal!.title,
        result: this.result(),
      } as IModal,
    });

    return dialogRef.afterClosed().pipe(
      map(result => {
        return result;
      })
    )

  }
}
