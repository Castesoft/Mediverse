import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { tap, of } from 'rxjs';
import { PatientEditComponent } from './components/patient-edit.component';
import { Modal } from '../_models/modal';
import { ConfirmService } from '../_services/confirm/confirm.service';

export const editGuard: CanDeactivateFn<PatientEditComponent> = (component, currentRoute, currentState, nextState) => {
  const modal: Modal = new Modal;
  const confirm = inject(ConfirmService);

  modal.title = 'Cambios no guardados';
  modal.message = 'Tienes cambios no guardados. ¿Estás seguro de que quieres salir sin guardar tu progreso en el formulario?';
  modal.btnOkText = 'Salir sin guardar';
  modal.btnCancelText = 'Cancelar';

  // if (component.editForm!.dirty) {
  //   return confirm.confirm(modal).pipe(
  //     tap(res => {
  //       return res;
  //     })
  //   )
  // }
  return of(true);
};
