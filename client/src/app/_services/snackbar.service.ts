import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private matSnackBar = inject(MatSnackBar);

  success(text: string, options?: {closeText: string}) {
    this.matSnackBar.open(text, options?.closeText ?? 'Cerrar',);
  }

  error(text: string, options?: {closeText: string}) {
    this.matSnackBar.open(text, options?.closeText ?? 'Cerrar', {panelClass: [ 'snackbar-danger' ]});
  }
}
